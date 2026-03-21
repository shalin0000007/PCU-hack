from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
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
def get_dashboard_stats():
    if not supabase:
        return {"total": 0, "highRisk": 0, "approved": 0, "riskDist": []}
    try:
        apps = supabase.table("applications").select("id, status").execute()
        reports = supabase.table("analysis_reports").select("risk_level").execute()
        
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

@router.delete("/applications/{application_id}")
def delete_application(application_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        # Get the application to find the company_id
        app_res = supabase.table("applications").select("company_id").eq("id", application_id).execute()
        if not app_res.data:
            raise HTTPException(status_code=404, detail="Application not found")
        company_id = app_res.data[0]["company_id"]
        
        # Delete related records first (cascade)
        supabase.table("ai_risk_assessments").delete().eq("application_id", application_id).execute()
        supabase.table("analysis_reports").delete().eq("application_id", application_id).execute()
        supabase.table("applications").delete().eq("id", application_id).execute()
        
        # Check if company has any other applications
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
    bank_file: Optional[UploadFile] = File(None)
):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # --- Input Validation ---
    if loan_amount <= 0:
        raise HTTPException(status_code=400, detail="Loan amount must be greater than 0")
    if not company_name.strip():
        raise HTTPException(status_code=400, detail="Company name is required")
    if not industry.strip():
        raise HTTPException(status_code=400, detail="Industry is required")
    if gst_file and not gst_file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="GST file must be a CSV")
    if bank_file and not bank_file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Bank statement file must be a CSV")
    
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
            "status": "Processing"
        }).execute()
        
        # Parse files FIRST so we can feed data into the risk scorer
        gst_bytes = await gst_file.read() if gst_file else None
        bank_bytes = await bank_file.read() if bank_file else None
        chart_data = parse_financial_files(gst_bytes, bank_bytes, industry)
        
        # Calculate risk using actual financial data
        score, risk_level, flags = calculate_risk_score(loan_amount, industry, chart_data)
        primary_flag = flags[0] if flags else None
        
        news = fetch_company_news(external_company or company_name)
        ai_summary = generate_risk_summary(company_name, score, flags, loan_amount)
        
        key_findings = [{"type": "warning", "title": "Flag Detected", "description": f} for f in flags]
        
        # --- Dynamic confidence score ---
        confidence = 15  # base
        if gst_bytes and bank_bytes:
            confidence += 30  # both CSVs uploaded
        elif gst_bytes or bank_bytes:
            confidence += 15  # only one
        
        gst_bank = chart_data.get("gst_vs_bank", [])
        if len(gst_bank) >= 12:
            confidence += 20  # 12+ months of data
        elif len(gst_bank) >= 6:
            confidence += 10
        
        # Data consistency bonus
        total_gst = sum(d.get("gstRevenue", 0) for d in gst_bank)
        total_bank = sum(d.get("bankCredits", 0) for d in gst_bank)
        if total_gst > 0:
            mismatch = abs(total_gst - total_bank) / total_gst * 100
            if mismatch < 10:
                confidence += 15
            elif mismatch < 20:
                confidence += 10
        
        # Real news found bonus
        is_real_news = any(n.get("url", "").startswith("http") and "ft.com" not in n.get("url", "") for n in news)
        if is_real_news:
            confidence += 10
        
        confidence = min(confidence, 98)  # cap at 98
        
        # Tiered recommended amount
        if risk_level == "low":
            recommended = float(loan_amount) * 1.0
        elif risk_level == "medium":
            recommended = float(loan_amount) * 0.75
        else:
            recommended = float(loan_amount) * 0.50
        
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
        
        # --- Auto-trigger full AI assessment (runs in same request) ---
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
        
        # Update report with AI-enriched summary if AI produced one
        if ai_summary_text and ai_summary_text != ai_summary:
            supabase.table("analysis_reports").update({
                "ai_summary": ai_summary_text,
                "confidence_score": ai_confidence
            }).eq("application_id", app_id).execute()
        
        # Set final status from AI result
        final_risk = ai_risk_level
        if final_risk == "high":
            status = "Flagged"
        elif final_risk == "low":
            status = "Approved"
        else:
            status = "Under Review"
        supabase.table("applications").update({"status": status}).eq("id", app_id).execute()
        
        return {"message": "Analysis complete", "application_id": app_id, "report_id": report.data[0]["id"]}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

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

@router.get("/report/{application_id}/pdf")
def generate_pdf_report(application_id: str):
    """Generate a downloadable PDF report for an application."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Fetch the same data CreditRiskAnalysis page uses
    app_res = supabase.table("applications").select("*, companies(*)").eq("id", application_id).execute()
    if not app_res.data:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app_data = app_res.data[0]
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).execute()
    report = report_res.data[0] if report_res.data else {}
    
    ai_res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    ai = ai_res.data[0] if ai_res.data else {}
    
    company_name = app_data.get("companies", {}).get("name", "Unknown Company") if isinstance(app_data.get("companies"), dict) else "Unknown Company"
    industry = app_data.get("companies", {}).get("industry", "N/A") if isinstance(app_data.get("companies"), dict) else "N/A"
    risk_score = ai.get("score", report.get("risk_score", 0))
    risk_level = ai.get("risk_level", report.get("risk_level", "unknown"))
    confidence = ai.get("confidence", report.get("confidence_score", 0))
    summary = ai.get("summary", report.get("ai_summary", "No summary available."))
    key_findings = ai.get("key_findings", report.get("key_findings", []))
    recommended = report.get("recommended_amount", 0)
    loan_amount = app_data.get("loan_amount", 0)
    
    # Build PDF
    from fpdf import FPDF
    
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Header
    pdf.set_fill_color(0, 179, 134)
    pdf.rect(0, 0, 210, 35, 'F')
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_y(8)
    pdf.cell(0, 10, "Intelli-Credit AI", ln=True, align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 8, "Credit Risk Analysis Report", ln=True, align="C")
    
    pdf.set_text_color(0, 0, 0)
    pdf.ln(10)
    
    # Company Info
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Company Information", ln=True)
    pdf.set_draw_color(0, 179, 134)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(45, 7, "Company:", 0, 0)
    pdf.cell(0, 7, str(company_name), ln=True)
    pdf.cell(45, 7, "Industry:", 0, 0)
    pdf.cell(0, 7, str(industry), ln=True)
    pdf.cell(45, 7, "Application ID:", 0, 0)
    pdf.cell(0, 7, str(application_id), ln=True)
    pdf.cell(45, 7, "Loan Amount:", 0, 0)
    pdf.cell(0, 7, f"Rs. {loan_amount:,.0f}", ln=True)
    pdf.ln(5)
    
    # Risk Assessment
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Risk Assessment", ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 24)
    if risk_level == "high":
        pdf.set_text_color(239, 68, 68)
    elif risk_level == "medium":
        pdf.set_text_color(245, 158, 11)
    else:
        pdf.set_text_color(16, 185, 129)
    pdf.cell(30, 12, str(risk_score), 0, 0)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(15, 12, "/ 100", 0, 0)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 12, f"  {risk_level.upper()} RISK", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(45, 7, "Confidence:", 0, 0)
    pdf.cell(0, 7, f"{confidence}%", ln=True)
    pdf.cell(45, 7, "Manual Review:", 0, 0)
    pdf.cell(0, 7, "Recommended" if risk_level == "high" else "Not Required", ln=True)
    pdf.ln(5)
    
    # AI Summary
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "AI Analysis Summary", ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 6, str(summary))
    pdf.ln(5)
    
    # Key Findings
    if key_findings:
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Key Findings", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(3)
        pdf.set_font("Helvetica", "", 10)
        for i, f in enumerate(key_findings, 1):
            desc = f.get("description", str(f)) if isinstance(f, dict) else str(f)
            pdf.cell(8, 6, f"{i}.", 0, 0)
            pdf.multi_cell(0, 6, desc)
            pdf.ln(1)
        pdf.ln(3)
    
    # Financial Summary
    chart_data = report.get("chart_data", {})
    gst_bank = chart_data.get("gst_vs_bank", [])
    total_gst = sum(d.get("gstRevenue", d.get("gst", 0)) for d in gst_bank)
    total_bank = sum(d.get("bankCredits", d.get("bank", 0)) for d in gst_bank)
    
    if total_gst > 0 or total_bank > 0:
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Financial Summary", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(3)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(45, 7, "GST Revenue:", 0, 0)
        pdf.cell(0, 7, f"Rs. {total_gst:,.0f}", ln=True)
        pdf.cell(45, 7, "Bank Credits:", 0, 0)
        pdf.cell(0, 7, f"Rs. {total_bank:,.0f}", ln=True)
        pdf.cell(45, 7, "Difference:", 0, 0)
        pdf.cell(0, 7, f"Rs. {abs(total_gst - total_bank):,.0f}", ln=True)
        pdf.ln(3)
    
    # Recommendation
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Final Recommendation", ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_fill_color(240, 253, 244)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(55, 8, "Recommended Amount:", 0, 0)
    pdf.cell(0, 8, f"Rs. {recommended:,.0f}", ln=True)
    if loan_amount > 0:
        pdf.set_font("Helvetica", "", 10)
        pct = round(recommended / loan_amount * 100)
        pdf.cell(0, 7, f"({pct}% of requested Rs. {loan_amount:,.0f})", ln=True)
    
    # Footer
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(0, 5, "This report was generated by Intelli-Credit AI Platform.", ln=True, align="C")
    pdf.cell(0, 5, "For internal use only. Not a legally binding document.", ln=True, align="C")
    
    # Output
    buf = BytesIO()
    pdf.output(buf)
    buf.seek(0)
    
    filename = f"CreditReport_{application_id}.pdf"
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

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
    
    # Auto-build context from all DB data so AI knows everything
    context = req.context or {}
    if supabase and not context:
        try:
            apps = supabase.table("applications").select("*, companies(name, industry), analysis_reports(*), ai_risk_assessments(*)").order("created_at", desc=True).limit(10).execute()
            
            portfolio = []
            for a in apps.data:
                comp = a.get("companies") or {}
                reports = a.get("analysis_reports") or []
                r = reports[0] if reports else {}
                ai_list = a.get("ai_risk_assessments") or []
                ai = ai_list[0] if ai_list else {}
                
                portfolio.append({
                    "app_id": a["id"],
                    "company": comp.get("name", "Unknown"),
                    "industry": comp.get("industry", "Unknown"),
                    "loan_amount": a.get("loan_amount"),
                    "status": a.get("status"),
                    "risk_score": ai.get("score") or r.get("risk_score"),
                    "risk_level": ai.get("risk_level") or r.get("risk_level"),
                    "confidence": ai.get("confidence") or r.get("confidence_score"),
                    "ai_summary": (ai.get("summary") or r.get("ai_summary", ""))[:200],
                    "primary_flag": r.get("primary_flag"),
                    "recommended_amount": r.get("recommended_amount"),
                    "key_findings": ai.get("key_findings") or r.get("key_findings") or [],
                    "chart_data_summary": {
                        "months_of_data": len((r.get("chart_data") or {}).get("gst_vs_bank", [])),
                        "has_industry_insights": bool((r.get("chart_data") or {}).get("industry_insights")),
                    }
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

@router.get("/report/{application_id}/pdf")
def download_report(application_id: str):
    """Generate a downloadable HTML report for an application."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    app_res = supabase.table("applications").select("*, companies(name, industry)").eq("id", application_id).execute()
    if not app_res.data:
        raise HTTPException(status_code=404, detail="Application not found")
    app = app_res.data[0]
    company = app.get("companies") or {}
    
    report_res = supabase.table("analysis_reports").select("*").eq("application_id", application_id).order("created_at", desc=True).limit(1).execute()
    report = report_res.data[0] if report_res.data else {}
    
    ai_res = supabase.table("ai_risk_assessments").select("*").eq("application_id", application_id).execute()
    ai = ai_res.data[0] if ai_res.data else {}
    
    company_name = company.get("name", "Unknown")
    industry = company.get("industry", "Unknown")
    risk_score = ai.get("score") or report.get("risk_score", 0)
    risk_level = ai.get("risk_level") or report.get("risk_level", "medium")
    confidence = ai.get("confidence") or report.get("confidence_score", 0)
    summary = ai.get("summary") or report.get("ai_summary", "No summary available.")
    findings = ai.get("key_findings") or report.get("key_findings") or []
    recommended = report.get("recommended_amount", 0)
    loan_amount = app.get("loan_amount", 0)
    
    findings_html = ""
    for f in findings:
        if isinstance(f, dict):
            desc = f.get("description") or f.get("text") or f.get("message", "")
            ftype = f.get("type", "warning")
            color = "#ef4444" if ftype == "error" else "#f59e0b" if ftype == "warning" else "#10b981"
            findings_html += f'<div style="padding:12px;margin:8px 0;border-left:4px solid {color};background:#fafafa;border-radius:8px;"><span style="color:{color};font-weight:600;">●</span> {desc}</div>'
    
    risk_color = "#ef4444" if risk_level == "high" else "#f59e0b" if risk_level == "medium" else "#10b981"
    
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Credit Risk Report - {company_name}</title>
<style>
body {{ font-family: 'Segoe UI', system-ui, sans-serif; margin:0; padding:40px; color:#1a1a1a; background:#fff; }}
.header {{ text-align:center; border-bottom:2px solid #00b386; padding-bottom:24px; margin-bottom:32px; }}
.header h1 {{ color:#00b386; margin:0 0 4px; font-size:28px; }}
.header p {{ color:#737373; margin:0; font-size:14px; }}
.section {{ margin-bottom:28px; }}
.section h2 {{ color:#1a1a1a; font-size:18px; border-bottom:1px solid #e5e5e5; padding-bottom:8px; }}
.grid {{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }}
.card {{ background:#fafafa; padding:16px; border-radius:12px; border:1px solid #e5e5e5; }}
.card label {{ font-size:11px; color:#737373; text-transform:uppercase; display:block; margin-bottom:4px; }}
.card .value {{ font-size:16px; font-weight:600; color:#1a1a1a; }}
.risk-badge {{ display:inline-block; padding:6px 20px; border-radius:100px; color:white; font-weight:600; font-size:14px; background:{risk_color}; }}
.score {{ font-size:56px; font-weight:700; color:#1a1a1a; line-height:1; }}
.summary {{ background:linear-gradient(135deg, #e5f7f3, #d1fae5); padding:20px; border-radius:12px; line-height:1.7; font-size:14px; }}
.footer {{ text-align:center; margin-top:40px; padding-top:20px; border-top:2px solid #00b386; color:#737373; font-size:12px; }}
@media print {{ body {{ padding:20px; }} }}
</style></head><body>
<div class="header">
<h1>📊 Intelli-Credit AI</h1>
<p>Credit Risk Analysis Report</p>
<p style="font-size:12px;margin-top:8px;">Generated: {report.get("created_at", "N/A")[:10]}</p>
</div>

<div class="section">
<h2>Company Information</h2>
<div class="grid">
<div class="card"><label>Company Name</label><div class="value">{company_name}</div></div>
<div class="card"><label>Industry</label><div class="value">{industry}</div></div>
<div class="card"><label>Application ID</label><div class="value">{application_id[:13]}...</div></div>
<div class="card"><label>Loan Requested</label><div class="value">₹{loan_amount:,.0f}</div></div>
</div>
</div>

<div class="section">
<h2>Risk Assessment</h2>
<div style="text-align:center;padding:20px;">
<div class="score">{risk_score}</div>
<div style="color:#737373;margin:4px 0 12px;">/100</div>
<div class="risk-badge">{risk_level.upper()} RISK</div>
<div style="margin-top:12px;color:#737373;">Confidence: {confidence}%</div>
</div>
</div>

<div class="section">
<h2>AI Analysis Summary</h2>
<div class="summary">{summary}</div>
</div>

<div class="section">
<h2>Key Findings</h2>
{findings_html if findings_html else '<p style="color:#10b981;">✓ No significant risk flags detected.</p>'}
</div>

<div class="section">
<h2>Final Recommendation</h2>
<div class="grid">
<div class="card"><label>Recommended Amount</label><div class="value" style="color:#00b386;">₹{recommended:,.0f}</div></div>
<div class="card"><label>Approval Rate</label><div class="value">{round((recommended / loan_amount * 100) if loan_amount else 0)}% of requested</div></div>
</div>
</div>

<div class="footer">
<p>This report was auto-generated by Intelli-Credit AI Platform</p>
<p>© 2026 Intelli-Credit AI. All rights reserved. Confidential.</p>
</div>
</body></html>"""
    
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=html, media_type="text/html")
