import random
import pandas as pd
import io

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

def parse_financial_files(gst_bytes: bytes, bank_bytes: bytes):
    chart_data = {
        "gst_vs_bank": [],
        "cash_flow": [],
        "industry_insights": [
            {"category": "Profitability", "company": 75, "industry": 82},
            {"category": "Liquidity", "company": 65, "industry": 60},
            {"category": "Growth", "company": 85, "industry": 70}
        ]
    }
    
    gst_map = {}
    if gst_bytes:
        try:
            df_gst = pd.read_csv(io.BytesIO(gst_bytes))
            for _, row in df_gst.iterrows():
                month_raw = str(row.get('Month', ''))
                month_short = month_raw.split('-')[0][:3] if '-' in month_raw else month_raw[:3]
                gst_val = float(row.get('GST_Filing_Amount', 0))
                gst_map[month_short] = gst_val
        except Exception as e:
            print("GST Parse Error:", e)

    bank_map = {}
    inflows = 0.0
    outflows = 0.0
    if bank_bytes:
        try:
            df_bank = pd.read_csv(io.BytesIO(bank_bytes))
            for _, row in df_bank.iterrows():
                dep = pd.to_numeric(row.get('Deposit', 0), errors='coerce')
                withd = pd.to_numeric(row.get('Withdrawal', 0), errors='coerce')
                dep = dep if pd.notna(dep) else 0
                withd = withd if pd.notna(withd) else 0
                
                inflows += dep
                outflows += withd
                
                date_str = str(row.get('Date', ''))
                if len(date_str) >= 7: 
                    month_num = int(date_str[5:7])
                    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    m_short = months[month_num - 1] if 1 <= month_num <= 12 else "Unk"
                    bank_map[m_short] = bank_map.get(m_short, 0) + dep
        except Exception as e:
            print("Bank Parse Error:", e)

    all_months = list(set(list(gst_map.keys()) + list(bank_map.keys())))
    month_order = {m: i for i, m in enumerate(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])}
    all_months.sort(key=lambda m: month_order.get(m, 99))
    
    for m in all_months:
        chart_data["gst_vs_bank"].append({
            "month": m,
            "gst": gst_map.get(m, 0),
            "bank": bank_map.get(m, 0)
        })
        
    chart_data["cash_flow"].append({
        "quarter": "Recent",
        "inflow": inflows,
        "outflow": outflows
    })
    
    return chart_data
