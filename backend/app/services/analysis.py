import random

def calculate_risk_score(loan_amount: float, industry: str) -> tuple[int, str, list]:
    """
    Heavy calculation stub for risk score generation based on mocked financials.
    Returns: (score, risk_level, flags)
    """
    score = random.randint(35, 85)
    
    flags = []
    if score < 50:
        risk_level = "high"
        flags.append("High debt-to-equity ratio")
        flags.append("Recent cash flow irregularities")
    elif score < 75:
        risk_level = "medium"
        flags.append("Slight revenue mismatch (15%)")
    else:
        risk_level = "low"
        
    return score, risk_level, flags

def generate_mock_chart_data():
    return {
        "gst_vs_bank": [
            {"month": "Jan", "gst": 850000, "bank": 820000},
            {"month": "Feb", "gst": 920000, "bank": 880000},
        ],
        "cash_flow": [
            {"quarter": "Q1", "inflow": 2800000, "outflow": 2400000},
        ],
        "industry_insights": [
            {"category": "Profitability", "company": 75, "industry": 82},
        ]
    }
