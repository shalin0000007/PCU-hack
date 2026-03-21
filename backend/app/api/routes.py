from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, LoginRequest, LoginResponse
import psycopg2
import urllib.parse
import sqlite3
from fastapi import status, HTTPException
DB_CONN_STR = 'postgresql://postgres:' + urllib.parse.quote_plus('TryHackMe@69') + '@db.izazxurlbjdfbrhrbtzt.supabase.co:5432/postgres'
from app.services.analysis import calculate_risk_score, generate_mock_chart_data
from app.services.ai_service import generate_risk_summary
from app.services.news_service import fetch_company_news
from app.core.config import supabase
import uuid

router = APIRouter()

@router.get("/applications")
def get_applications():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    res = supabase.table("applications").select("*, companies(name)").execute()
    
    apps = []
    for app in res.data:
        report_res = supabase.table("analysis_reports").select("risk_score, risk_level, primary_flag, confidence_score").eq("application_id", app["id"]).order("created_at", desc=True).limit(1).execute()
        report = report_res.data[0] if report_res.data else {}
        
        apps.append({
            "id": app["id"],
            "company_name": app["companies"]["name"] if app.get("companies") else "Unknown",
            "loan_amount": float(app["loan_amount"]),
            "status": app["status"],
            "risk_score": report.get("risk_score"),
            "risk_level": report.get("risk_level"),
            "confidence": report.get("confidence_score"),
            "flag": report.get("primary_flag")
        })
        
    return apps

@router.post("/analyze")
def start_analysis(request: AnalysisRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    comp_res = supabase.table("companies").select("id").eq("name", request.company_name).execute()
    if not comp_res.data:
        new_comp = supabase.table("companies").insert({"name": request.company_name, "industry": request.industry}).execute()
        company_id = new_comp.data[0]["id"]
    else:
        company_id = comp_res.data[0]["id"]
        
    app_id = f"APP-2026-{str(uuid.uuid4())[:4].upper()}"
    supabase.table("applications").insert({
        "id": app_id,
        "company_id": company_id,
        "loan_amount": request.loan_amount,
        "purpose": request.purpose,
        "status": "Processing"
    }).execute()
    
    score, risk_level, flags = calculate_risk_score(request.loan_amount, request.industry)
    primary_flag = flags[0] if flags else None
    
    news = fetch_company_news(request.external_company or request.company_name)
    ai_summary = generate_risk_summary(request.company_name, score, flags, request.loan_amount)
    
    chart_data = generate_mock_chart_data()
    key_findings = [{"type": "warning", "title": "Flag Detected", "description": f} for f in flags]
    
    report = supabase.table("analysis_reports").insert({
        "application_id": app_id,
        "risk_score": score,
        "risk_level": risk_level,
        "confidence_score": 85,
        "ai_summary": ai_summary,
        "recommended_amount": float(request.loan_amount) * (0.7 if risk_level != 'low' else 1.0),
        "manual_review_required": (risk_level == 'high'),
        "primary_flag": primary_flag,
        "key_findings": key_findings,
        "chart_data": chart_data,
        "news_data": news
    }).execute()
    
    status = "Under Review" if risk_level == "medium" else ("Flagged" if risk_level == "high" else "Approved")
    supabase.table("applications").update({"status": status}).eq("id", app_id).execute()
    
    return {"message": "Analysis complete", "application_id": app_id, "report_id": report.data[0]["id"]}

@router.get("/analysis/{application_id}")
def get_analysis_report(application_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    report = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report.data:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return report.data[0]

@router.get("/news")
def get_news(company: str):
    news = fetch_company_news(company)
    return {"company": company, "news": news}


def init_supabase_db():
    try:
        conn = psycopg2.connect(DB_CONN_STR)
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            )
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Supabase DB Init Error:", e)

def get_sqlite_conn():
    conn = sqlite3.connect("fallback_users.db")
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS app_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user'
        )
    ''')
    conn.commit()
    return conn

# Run init once
init_supabase_db()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    # Static checking for Admin sample credentials
    if request.username == "Admin":
        if request.password == "Admin@123":
            return {"username": "Admin", "role": "admin", "message": "Login successful"}
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Admin credentials")
            
    # Attempt connecting to Supabase database
    try:
        conn = psycopg2.connect(DB_CONN_STR)
        cur = conn.cursor()
        cur.execute("SELECT password, role FROM app_users WHERE username = %s", (request.username,))
        user = cur.fetchone()
        
        if user:
            if user[0] == request.password:
                role = user[1]
                cur.close()
                conn.close()
                return {"username": request.username, "role": role, "message": "Login successful"}
            else:
                cur.close()
                conn.close()
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials for existing user")
        else:
            # Create new user
            cur.execute("INSERT INTO app_users (username, password, role) VALUES (%s, %s, 'user') RETURNING role", (request.username, request.password))
            role = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {"username": request.username, "role": role, "message": "User created and logged in"}
            
    except psycopg2.Error as e:
        print(f"Supabase error, using SQLite Fallback. Reason: {e}")
        # Supabase unavailable (IPv6 block etc.), use local SQLite fallback
        try:
            sl_conn = get_sqlite_conn()
            cur = sl_conn.cursor()
            cur.execute("SELECT password, role FROM app_users WHERE username = ?", (request.username,))
            user = cur.fetchone()
            
            if user:
                if user[0] == request.password:
                    role = user[1]
                    cur.close()
                    sl_conn.close()
                    return {"username": request.username, "role": role, "message": "Login successful (fallback)"}
                else:
                    cur.close()
                    sl_conn.close()
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            else:
                cur.execute("INSERT INTO app_users (username, password, role) VALUES (?, ?, 'user')", (request.username, request.password))
                sl_conn.commit()
                cur.close()
                sl_conn.close()
                return {"username": request.username, "role": "user", "message": "User created in fallback DB"}
        except HTTPException as h:
            raise h
        except Exception as sqlite_error:
            print("SQLite fallback failed:", sqlite_error)
            raise HTTPException(status_code=500, detail="Internal server error linking databases")

