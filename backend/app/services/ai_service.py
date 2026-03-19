import os

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
