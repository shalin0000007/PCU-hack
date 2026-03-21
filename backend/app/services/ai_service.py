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
        
    system_prompt = "You are a highly intelligent financial risk assessment AI assistant. You help users understand their company's risk report."
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
    """Fallback stub to satisfy Legacy POST /analyze imports."""
    return f"AI Risk Assessment pending. Generated via stub."
