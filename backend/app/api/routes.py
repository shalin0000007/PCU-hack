from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse
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
