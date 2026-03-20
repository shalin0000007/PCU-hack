from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Optional
from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, ChatRequest
from app.services.analysis import calculate_risk_score, parse_financial_files
from app.services.ai_service import generate_risk_summary
from app.services.news_service import fetch_company_news
from app.core.config import supabase
import uuid

router = APIRouter()

@router.get("/applications")
def get_applications():
    if not supabase:
        return []
    res = supabase.table("applications").select("*, companies(name), analysis_reports(*)").order("created_at", desc=True).execute()
    apps = []
    for item in res.data:
        comp_name = item.get("companies", {}).get("name") if item.get("companies") else "Unknown"
        reports = item.get("analysis_reports", [])
        report = reports[0] if reports else {}
        
        apps.append({
            "id": item["id"],
            "company": comp_name,
            "loanAmount": f"₹{int(item['loan_amount']):,}",
            "riskScore": report.get("risk_score", 0),
            "riskLevel": report.get("risk_level", "medium"),
            "status": item["status"],
            "confidence": report.get("confidence_score", 0),
            "flag": report.get("primary_flag"),
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

@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    from app.services.ai_service import chat_with_agent
    response = chat_with_agent(req.message, req.context)
    return {"reply": response}
