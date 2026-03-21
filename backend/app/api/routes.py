from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from fastapi.responses import StreamingResponse
from typing import Optional
from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, ChatRequest
from app.services.analysis import calculate_risk_score, parse_financial_files
from app.services.ai_service import generate_risk_summary
from app.services.news_service import fetch_company_news
from app.core.config import supabase
import uuid
from io import BytesIO

router = APIRouter()

@router.get("/dashboard-stats")
def get_dashboard_stats(x_user_email: Optional[str] = Header(None)):
    if not supabase:
        return {"total": 0, "highRisk": 0, "approved": 0, "riskDist": []}
    try:
        # Filter applications strictly by the logged-in user's email
        apps_query = supabase.table("applications").select("id, status")
        if x_user_email:
            apps_query = apps_query.eq("user_email", x_user_email)
        apps = apps_query.execute()
        
        app_ids = [a["id"] for a in apps.data] if apps.data else []
        
        if not app_ids:
            return {"total": 0, "highRisk": 0, "approved": 0, "approvalRate": 0, "riskDist": []}
            
        reports = supabase.table("analysis_reports").select("risk_level").in_("application_id", app_ids).execute()
        
        total = len(apps.data)
        high_risk = sum(1 for r in reports.data if r.get("risk_level") == "high")
        approved = sum(1 for a in apps.data if a.get("status") == "Approved")
        medium = sum(1 for r in reports.data if r.get("risk_level") == "medium")
        low = sum(1 for r in reports.data if r.get("risk_level") == "low")
        
        if total > 0:
            low_pct = round(low / total * 100)
            med_pct = round(medium / total * 100)
            high_pct = round(high_risk / total * 100)
            approval_rate = round(approved / total * 100, 1)
        else:
            low_pct = med_pct = high_pct = 0
            approval_rate = 0
        
        return {
            "total": total,
            "highRisk": high_risk,
            "approved": approved,
            "approvalRate": approval_rate,
            "riskDist": [
                {"name": "Low Risk", "value": low_pct, "color": "#10b981"},
                {"name": "Medium Risk", "value": med_pct, "color": "#f59e0b"},
                {"name": "High Risk", "value": high_pct, "color": "#ef4444"},
            ]
        }
    except Exception as e:
        print(f"Dashboard stats error: {e}")
        return {"total": 0, "highRisk": 0, "approved": 0, "riskDist": []}

@router.get("/applications")
def get_applications(x_user_email: Optional[str] = Header(None)):
    if not supabase:
        return []
    
    query = supabase.table("applications").select("*, companies(name), analysis_reports(*), ai_risk_assessments(*)")
    if x_user_email:
        query = query.eq("user_email", x_user_email)
        
    res = query.order("created_at", desc=True).execute()
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

@router.delete("/applications/{application_id}")
def delete_application(application_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        app_res = supabase.table("applications").select("company_id").eq("id", application_id).execute()
        if not app_res.data:
            raise HTTPException(status_code=404, detail="Application not found")
        company_id = app_res.data[0]["company_id"]
        
        supabase.table("ai_risk_assessments").delete().eq("application_id", application_id).execute()
        supabase.table("analysis_reports").delete().eq("application_id", application_id).execute()
        supabase.table("applications").delete().eq("id", application_id).execute()
        
        remaining = supabase.table("applications").select("id").eq("company_id", company_id).execute()
        if not remaining.data:
            supabase.table("companies").delete().eq("id", company_id).execute()
        
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def start_analysis(
    company_name: str = Form(...),
    industry: str = Form(...),
    loan_amount: float = Form(...),
    purpose: str = Form(...),
    external_company: Optional[str] = Form(None),
    gst_file: Optional[UploadFile] = File(None),
    bank_file: Optional[UploadFile] = File(None),
    x_user_email: Optional[str] = Header(None)
):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    if loan_amount <= 0: raise HTTPException(status_code=400, detail="Loan amount must be greater than 0")
    if not company_name.strip(): raise HTTPException(status_code=400, detail="Company name is required")
    if not industry.strip(): raise HTTPException(status_code=400, detail="Industry is required")
    if gst_file and not gst_file.filename.lower().endswith(".csv"): raise HTTPException(status_code=400, detail="GST file must be a CSV")
    if bank_file and not bank_file.filename.lower().endswith(".csv"): raise HTTPException(status_code=400, detail="Bank statement file must be a CSV")
    
    try:
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
            "status": "Processing",
            "user_email": x_user_email
        }).execute()
        
        gst_bytes = await gst_file.read() if gst_file else None
        bank_bytes = await bank_file.read() if bank_file else None
        chart_data = parse_financial_files(gst_bytes, bank_bytes, industry)
        
        score, risk_level, flags = calculate_risk_score(loan_amount, industry, chart_data)
        primary_flag = flags[0] if flags else None
        
        news = fetch_company_news(external_company or company_name)
        ai_summary = generate_risk_summary(company_name, score, flags, loan_amount)
        
        key_findings = [{"type": "warning", "title": "Flag Detected", "description": f} for f in flags]
        
        confidence = 15
        if gst_bytes and bank_bytes: confidence += 30
        elif gst_bytes or bank_bytes: confidence += 15
        
        gst_bank = chart_data.get("gst_vs_bank", [])
        if len(gst_bank) >= 12: confidence += 20
        elif len(gst_bank) >= 6: confidence += 10
        
        total_gst = sum(d.get("gstRevenue", 0) for d in gst_bank)
        total_bank = sum(d.get("bankCredits", 0) for d in gst_bank)
        if total_gst > 0:
            mismatch = abs(total_gst - total_bank) / total_gst * 100
            if mismatch < 10: confidence += 15
            elif mismatch < 20: confidence += 10
        
        is_real_news = any(n.get("url", "").startswith("http") and "ft.com" not in n.get("url", "") for n in news)
        if is_real_news: confidence += 10
        
        confidence = min(confidence, 98)
        
        if risk_level == "low": recommended = float(loan_amount) * 1.0
        elif risk_level == "medium": recommended = float(loan_amount) * 0.75
        else: recommended = float(loan_amount) * 0.50
        
        report = supabase.table("analysis_reports").insert({
            "application_id": app_id,
            "risk_score": score,
            "risk_level": risk_level,
            "confidence_score": confidence,
            "ai_summary": ai_summary,
            "recommended_amount": recommended,
            "manual_review_required": (risk_level == 'high'),
            "primary_flag": primary_flag,
            "key_findings": key_findings,
            "chart_data": chart_data,
            "news_data": news
        }).execute()
        
        from app.services.ai_service import generate_ai_risk_assessment
        ai_assessment = generate_ai_risk_assessment(company_name, chart_data, news)
        
        ai_score = ai_assessment.get("score", score)
        ai_risk_level = ai_assessment.get("risk_level", risk_level)
        ai_confidence = ai_assessment.get("confidence", 78)
        ai_summary_text = ai_assessment.get("summary", ai_summary)
        ai_findings = ai_assessment.get("key_findings", key_findings)
        
        supabase.table("ai_risk_assessments").insert({
            "application_id": app_id,
            "score": ai_score,
            "risk_level": ai_risk_level,
            "confidence": ai_confidence,
            "manual_review": ai_assessment.get("manual_review", risk_level == "high"),
            "summary": ai_summary_text,
            "key_findings": ai_findings
        }).execute()
        
        if ai_summary_text and ai_summary_text != ai_summary:
            supabase.table("analysis_reports").update({
                "ai_summary": ai_summary_text,
                "confidence_score": ai_confidence
            }).eq("application_id", app_id).execute()
        
        final_risk = ai_risk_level
        if final_risk == "high": status = "Flagged"
        elif final_risk == "low": status = "Approved"
        else: status = "Under Review"
        supabase.table("applications").update({"status": status}).eq("id", app_id).execute()
        
        return {"message": "Analysis complete", "application_id": app_id, "report_id": report.data[0]["id"]}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/analysis/{application_id}")
def get_analysis_report(application_id: str):
    if not supabase: raise HTTPException(status_code=500, detail="Supabase not configured")
    app_res = supabase.table("applications").select("*, companies(name, industry)").eq("id", application_id).execute()
    if not app_res.data: raise HTTPException(status_code=404, detail="Application not found")
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data: raise HTTPException(status_code=404, detail="Report not generated yet or not found")
    return {"application": app_res.data[0], "report": report_res.data[0]}

@router.get("/news")
def get_news(company: str):
    news = fetch_company_news(company)
    return {"company": company, "news": news}

@router.get("/report/{application_id}/pdf")
def generate_pdf_report(application_id: str):
    raise HTTPException(status_code=400, detail="Please use HTML download")

@router.get("/ai-assessment/{application_id}")
def get_ai_assessment(application_id: str):
    if not supabase: raise HTTPException(status_code=500, detail="Supabase not configured")
    res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    if res.data: return res.data[0]
    app_res = supabase.table("applications").select("*, companies(name)").eq("id", application_id).execute()
    if not app_res.data: raise HTTPException(status_code=404, detail="App not found")
    company_name = app_res.data[0].get("companies", {}).get("name", "Unknown")
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data: raise HTTPException(status_code=404, detail="Report not generated")
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
def chat_endpoint(req: ChatRequest, x_user_email: Optional[str] = Header(None)):
    from app.services.ai_service import chat_with_agent
    context = req.context or {}
    if supabase and not context:
        try:
            apps_query = supabase.table("applications").select("*, companies(name, industry), analysis_reports(*), ai_risk_assessments(*)").order("created_at", desc=True).limit(10)
            if x_user_email: apps_query = apps_query.eq("user_email", x_user_email)
            apps = apps_query.execute()
            
            portfolio = []
            for a in apps.data:
                comp, reports, ai_list = a.get("companies") or {}, a.get("analysis_reports") or [], a.get("ai_risk_assessments") or []
                r, ai = reports[0] if reports else {}, ai_list[0] if ai_list else {}
                portfolio.append({
                    "app_id": a["id"], "company": comp.get("name", "Unknown"), "industry": comp.get("industry", "Unknown"), "loan_amount": a.get("loan_amount"), "status": a.get("status"), "risk_score": ai.get("score") or r.get("risk_score"), "risk_level": ai.get("risk_level") or r.get("risk_level"), "confidence": ai.get("confidence") or r.get("confidence_score")
                })
            context = {"portfolio": portfolio, "total_applications": len(apps.data)}
        except Exception as e:
            print(f"Chat context error: {e}")
    response = chat_with_agent(req.message, context)
    return {"reply": response}

@router.post("/chat/{application_id}")
def chat_with_report(application_id: str, req: ChatRequest):
    if not supabase: raise HTTPException(status_code=500, detail="Supabase not configured")
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    if not report_res.data: raise HTTPException(status_code=404, detail="Report not found")
    report_data = report_res.data[0]
    app_res = supabase.table("applications").select("*, companies(name)").eq("id", application_id).execute()
    app_data = app_res.data[0] if app_res.data else {}
    company_name = app_data.get("companies", {}).get("name", "Unknown")
    ai_res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    ai_data = ai_res.data[0] if ai_res.data else {}
    context = {
        "company_name": company_name, "loan_requested": app_data.get("loan_amount"), "risk_score": ai_data.get("score") or report_data.get("risk_score"), "risk_level": ai_data.get("risk_level") or report_data.get("risk_level"), "ai_summary": ai_data.get("summary") or report_data.get("ai_summary"), "key_findings": ai_data.get("key_findings") or report_data.get("key_findings") or [], "news": report_data.get("news_data") or [], "financial_data": report_data.get("chart_data", {})
    }
    from app.services.ai_service import chat_with_agent
    response = chat_with_agent(user_message=f"Answer the following question about {company_name} based on the provided report context: {req.message}", context=context)
    return {"reply": response}
