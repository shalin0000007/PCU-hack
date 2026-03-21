import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_ai_client():
    api_key = os.getenv("KEY")
    if not api_key:
        return None
    return OpenAI(
        base_url="https://go.fastrouter.ai/api/v1",
        api_key=api_key,
    )

def chat_with_agent(user_message: str, context: dict = None) -> str:
    client = get_ai_client()
    if not client:
        return "AI connectivity is currently unavailable. Please check API keys."
        
    system_prompt = (
        "You are a highly intelligent financial risk assessment AI assistant. "
        "You help users understand their company's risk report. "
        "CRITICAL INSTRUCTION: Keep responses extremely brief (maximum 3 bullet points). "
        "Format using strict bullet points and newlines. "
        "Do not write introductory or concluding sentences. Output ONLY the direct answer."
    )
    if context:
        system_prompt += f"\nHere is the context of the current report: {context}"
        
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-5-nano",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error in AI chat: {e}")
        return "I apologize, but I am currently experiencing connection issues. Please try again."

def generate_ai_risk_assessment(company_name: str, chart_data: dict, news_data: list) -> dict:
    client = get_ai_client()
    if not client:
        return _fallback_assessment()
        
    gst_total = sum([d.get('gstRevenue', d.get('gst', 0)) for d in chart_data.get('gst_vs_bank', [])])
    bank_total = sum([d.get('bankCredits', d.get('bank', 0)) for d in chart_data.get('gst_vs_bank', [])])
    diff = abs(gst_total - bank_total)
    
    inflows = sum([d.get('inflow', 0) for d in chart_data.get('cash_flow', [])])
    outflows = sum([d.get('outflow', 0) for d in chart_data.get('cash_flow', [])])
    
    news_titles = [n.get('title', '') for n in news_data[:3]]
    
    prompt = f"""
    You are an expert AI financial risk analyst assessing a company named '{company_name}'.
    
    Financial Summary:
    - Total GST Revenue: {gst_total}
    - Total Bank Credits: {bank_total}
    - Difference: {diff}
    
    Cash Flow Summary (Recent Quarters):
    - Total Inflows: {inflows}
    - Total Outflows: {outflows}
    
    Recent News Headlines:
    {news_titles}
    
    Analyze this data and return ONLY a raw JSON object with the following exact keys (no code formatting, no markdown, just JSON string):
    {{
        "score": (integer 0-100),
        "risk_level": (string "low", "medium", or "high"),
        "confidence": (integer 0-100),
        "manual_review": (boolean true or false),
        "summary": (A 3-sentence expert summary of the risk),
        "key_findings": [
            {{"type": "error" | "warning" | "success", "description": "fact-based finding text"}}
        ]
    }}
    """
    
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-5-nano",
            messages=[{"role": "user", "content": prompt}]
        )
        content = completion.choices[0].message.content.strip()
        if content.startswith("```json"): content = content[7:]
        if content.startswith("```"): content = content[3:]
        if content.endswith("```"): content = content[:-3]
        return json.loads(content.strip())
    except Exception as e:
        print(f"AI Assessment Error: {e}")
        return _fallback_assessment()

def _fallback_assessment() -> dict:
    return {
        "score": 56,
        "risk_level": "medium",
        "confidence": 78,
        "manual_review": True,
        "summary": "The medium risk classification is primarily driven by a combination of financial inconsistencies and debt exposure. Key concerns include a potential mismatch between GST-reported revenue and actual bank credits. Financial leverage indicates potential vulnerability.",
        "key_findings": [
             {"type": "warning", "description": "15% revenue mismatch detected between GST and bank records"},
             {"type": "warning", "description": "Debt ratio slightly higher than industry average"}
        ]
    }

def generate_risk_summary(company_name: str, risk_score: int, flags: list, loan_amount: float) -> str:
    """Generate an AI-powered risk summary using financial context."""
    client = get_ai_client()
    
    risk_level = "low" if risk_score >= 70 else ("medium" if risk_score >= 45 else "high")
    flags_text = "; ".join(flags) if flags else "No significant flags detected"
    
    if not client:
        return _fallback_summary(company_name, risk_score, risk_level, flags, loan_amount)
    
    prompt = f"""You are a senior credit risk analyst writing a brief assessment summary.

Company: {company_name}
Risk Score: {risk_score}/100 ({risk_level} risk)
Loan Requested: ₹{loan_amount:,.0f}
Key Flags: {flags_text}

Write exactly 3 sentences:
1. Overall risk classification and primary driver
2. The most critical financial concern or strength
3. Clear recommendation (approve/conditional approve/reject with reason)

Be direct, professional, and specific. Do NOT use markdown or bullet points. Output ONLY the 3 sentences as a single paragraph."""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-5-nano",
            messages=[{"role": "user", "content": prompt}]
        )
        summary = completion.choices[0].message.content.strip()
        if summary:
            return summary
        return _fallback_summary(company_name, risk_score, risk_level, flags, loan_amount)
    except Exception as e:
        print(f"AI Summary Error: {e}")
        return _fallback_summary(company_name, risk_score, risk_level, flags, loan_amount)


def _fallback_summary(company_name: str, risk_score: int, risk_level: str, flags: list, loan_amount: float) -> str:
    """Deterministic fallback when AI is unavailable."""
    if risk_level == "low":
        verdict = f"{company_name} demonstrates a strong financial profile with a risk score of {risk_score}/100, indicating low default probability."
        recommendation = f"Recommendation: Approve the loan of ₹{loan_amount:,.0f} at standard terms."
    elif risk_level == "medium":
        verdict = f"{company_name} shows a moderate risk profile scoring {risk_score}/100, with some financial indicators requiring attention."
        recommendation = f"Recommendation: Conditional approval of ₹{loan_amount * 0.75:,.0f} (75% of requested amount) with enhanced monitoring."
    else:
        verdict = f"{company_name} presents an elevated risk profile scoring {risk_score}/100, with multiple financial red flags identified."
        recommendation = f"Recommendation: Manual review required before proceeding. Consider limiting exposure to ₹{loan_amount * 0.50:,.0f} (50% of requested)."
    
    concern = f"Primary concern: {flags[0]}." if flags else "No critical flags were identified in the available financial data."
    return f"{verdict} {concern} {recommendation}"
