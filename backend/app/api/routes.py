from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from typing import Optional
from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, ChatRequest, LoginRequest, LoginResponse
from app.services.analysis import calculate_risk_score, parse_financial_files, generate_mock_chart_data
import psycopg2
import urllib.parse
import sqlite3

DB_CONN_STR = 'postgresql://postgres:' + urllib.parse.quote_plus('TryHackMe@69') + '@db.izazxurlbjdfbrhrbtzt.supabase.co:5432/postgres'
from app.services.ai_service import generate_risk_summary
from app.services.news_service import fetch_company_news
from app.core.config import supabase
import uuid

router = APIRouter()

@router.get("/applications")
def get_applications():
    if not supabase:
        return []
    res = supabase.table("applications").select("*, companies(name), analysis_reports(*), ai_risk_assessments(*)").order("created_at", desc=True).execute()
    apps = []
    for item in res.data:
        comp_name = item.get("companies", {}).get("name") if item.get("companies") else "Unknown"
        reports = item.get("analysis_reports", [])
        report = reports[0] if reports else {}
        
        ai_assessments = item.get("ai_risk_assessments", [])
        ai_data = ai_assessments[0] if ai_assessments else {}
        
        risk_score = ai_data.get("score") if ai_data else report.get("risk_score", 0)
        risk_level = ai_data.get("risk_level") if ai_data else report.get("risk_level", "medium")
        confidence = ai_data.get("confidence") if ai_data else report.get("confidence_score", 0)
        
        flag = report.get("primary_flag")
        if ai_data and ai_data.get("key_findings"):
            try:
                flags = []
                for f in ai_data["key_findings"]:
                    if not isinstance(f, dict): continue
                    if f.get("type") not in ["error", "warning"]: continue
                    text = f.get("message") or f.get("text") or f.get("description") or f.get("title") or ""
                    if text:
                        flags.append(text)
                if flags:
                    flag = flags[0]
            except Exception:
                pass
                 
        status = item["status"]
        if ai_data:
             if risk_level.lower() == "high": status = "Flagged"
             elif risk_level.lower() == "low": status = "Approved"
             elif risk_level.lower() == "medium": status = "Under Review"

        apps.append({
            "id": item["id"],
            "company": comp_name,
            "loanAmount": f"₹{int(item['loan_amount']):,}",
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "status": status,
            "confidence": confidence,
            "flag": flag,
            "date": item["created_at"].split("T")[0]
        })
    return apps

@router.post("/analyze")
async def start_analysis(
    company_name: str = Form(...),
    industry: str = Form(...),
    loan_amount: float = Form(...),
    purpose: str = Form(...),
    external_company: Optional[str] = Form(None),
    gst_file: Optional[UploadFile] = File(None),
    bank_file: Optional[UploadFile] = File(None)
):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    comp_res = supabase.table("companies").select("id").eq("name", company_name).execute()
    if not comp_res.data:
        new_comp = supabase.table("companies").insert({"name": company_name, "industry": industry}).execute()
        company_id = new_comp.data[0]["id"]
    else:
        company_id = comp_res.data[0]["id"]
        
    app_id = f"APP-2026-{str(uuid.uuid4())[:4].upper()}"
    supabase.table("applications").insert({
        "id": app_id,
        "company_id": company_id,
        "loan_amount": loan_amount,
        "purpose": purpose,
        "status": "Processing"
    }).execute()
    
    score, risk_level, flags = calculate_risk_score(loan_amount, industry)
    primary_flag = flags[0] if flags else None
    
    news = fetch_company_news(external_company or company_name)
    ai_summary = generate_risk_summary(company_name, score, flags, loan_amount)
    
    gst_bytes = await gst_file.read() if gst_file else None
    bank_bytes = await bank_file.read() if bank_file else None
    
    chart_data = parse_financial_files(gst_bytes, bank_bytes)
    key_findings = [{"type": "warning", "title": "Flag Detected", "description": f} for f in flags]
    
    report = supabase.table("analysis_reports").insert({
        "application_id": app_id,
        "risk_score": score,
        "risk_level": risk_level,
        "confidence_score": 85,
        "ai_summary": ai_summary,
        "recommended_amount": float(loan_amount) * (0.7 if risk_level != 'low' else 1.0),
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
        
    app_res = supabase.table("applications").select("*, companies(name, industry)").eq("id", application_id).execute()
    if not app_res.data:
        raise HTTPException(status_code=404, detail="Application not found")
        
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data:
        raise HTTPException(status_code=404, detail="Report not generated yet or not found")
        
    app_data = app_res.data[0]
    report_data = report_res.data[0]
    
    return {
        "application": app_data,
        "report": report_data
    }

@router.get("/news")
def get_news(company: str):
    news = fetch_company_news(company)
    return {"company": company, "news": news}

@router.delete("/applications/{application_id}")
def delete_application(application_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    # Delete cascaded artifacts to satisfy foreign key structure
    supabase.table("analysis_reports").delete().eq("application_id", application_id).execute()
    
    res = supabase.table("applications").delete().eq("id", application_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {"message": "Application deleted successfully"}

@router.get("/ai-assessment/{application_id}")
def get_ai_assessment(application_id: str):
    if not supabase: raise HTTPException(status_code=500, detail="Supabase not configured")
        
    res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    if res.data:
        return res.data[0]
        
    app_res = supabase.table("applications").select("*, companies(name)").eq("id", application_id).execute()
    if not app_res.data:
        raise HTTPException(status_code=404, detail="App not found")
        
    company_name = app_res.data[0].get("companies", {}).get("name", "Unknown")
    
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data:
        raise HTTPException(status_code=404, detail="Report not generated")
        
    chart_data = report_res.data[0].get("chart_data", {})
    news_data = report_res.data[0].get("news_data", [])
    
    from app.services.ai_service import generate_ai_risk_assessment
    assessment = generate_ai_risk_assessment(company_name, chart_data, news_data)
    
    ins_res = supabase.table("ai_risk_assessments").insert({
        "application_id": application_id,
        "score": assessment.get("score", 50),
        "risk_level": assessment.get("risk_level", "medium"),
        "confidence": assessment.get("confidence", 50),
        "manual_review": assessment.get("manual_review", True),
        "summary": assessment.get("summary", ""),
        "key_findings": assessment.get("key_findings", [])
    }).execute()
    
    return ins_res.data[0]

@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    from app.services.ai_service import chat_with_agent
    response = chat_with_agent(req.message, req.context)
    return {"reply": response}

@router.post("/chat/{application_id}")
def chat_with_report(application_id: str, req: ChatRequest):
    if not supabase: raise HTTPException(status_code=500, detail="Supabase not configured")
    
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data:
        raise HTTPException(status_code=404, detail="Report not found")
    report_data = report_res.data[0]
    
    app_res = supabase.table("applications").select("*, companies(name)").eq("id", application_id).execute()
    app_data = app_res.data[0] if app_res.data else {}
    company_name = app_data.get("companies", {}).get("name", "Unknown")
    
    ai_res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    ai_data = ai_res.data[0] if ai_res.data else {}
    
    context = {
        "company_name": company_name,
        "loan_requested": app_data.get("loan_amount"),
        "risk_score": ai_data.get("score") or report_data.get("risk_score"),
        "risk_level": ai_data.get("risk_level") or report_data.get("risk_level"),
        "ai_summary": ai_data.get("summary") or report_data.get("ai_summary"),
        "key_findings": ai_data.get("key_findings") or report_data.get("key_findings") or [],
        "news": report_data.get("news_data") or [],
        "financial_data": report_data.get("chart_data", {})
    }
    
    from app.services.ai_service import chat_with_agent
    response = chat_with_agent(
        user_message=f"Answer the following question about {company_name} based on the provided report context: {req.message}", 
        context=context
    )
    return {"reply": response}

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
