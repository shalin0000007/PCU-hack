from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ApplicationResponse(BaseModel):
    id: str
    company_name: str
    loan_amount: float
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    status: str
    confidence: Optional[int] = None
    flag: Optional[str] = None

class AnalysisRequest(BaseModel):
    company_name: str
    industry: str
    loan_amount: float
    purpose: str
    external_company: Optional[str] = None

class AnalysisReportResponse(BaseModel):
    id: str
    application_id: str
    risk_score: int
    risk_level: str
    confidence_score: int
    ai_summary: str
    recommended_amount: float
    manual_review_required: bool
    primary_flag: Optional[str] = None
    key_findings: List[Dict[str, Any]]
    chart_data: Dict[str, Any]
    news_data: List[Dict[str, Any]]
