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

def chat_with_agent(message: str, context: dict = None) -> str:
    client = get_ai_client()
    if not client:
        return "Error: AI API key not configured. Please add KEY to .env"
        
    system_prompt = "You are a helpful AI Credit Risk Analyst. Answer the user's questions clearly and professionally."
    if context:
        system_prompt += f"\n\nHere is the context of the current report:\n{json.dumps(context, indent=2)}"
        
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-5-nano",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"
def generate_risk_summary(company_name: str, risk_score: int, flags: list, loan_amount: float) -> str:
    """
    Stub for AI generation. In production, this would call OpenAI or Anthropic API.
    """
    if risk_score > 70:
        return f"AI Analysis: {company_name} shows strong indicators of growth and financial stability, leading to a high credit score of {risk_score}. Recommended to approve the full {loan_amount} request."
    elif risk_score > 40:
        concerns = ", ".join(flags) if flags else "moderate financial inconsistencies"
        return f"AI Analysis: {company_name} presents a medium risk profile with a score of {risk_score}. Primary concerns include {concerns}. Recommended to approve 70% of the requested amount with quarterly reviews."
    else:
        concerns = ", ".join(flags) if flags else "severe financial distress"
        return f"AI Analysis: {company_name} is considered high risk (score {risk_score}) due to {concerns}. Recommended to reject or require significant collateral."
