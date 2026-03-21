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
            {"category": "Profit Margin", "company": 12, "industry": 15},
            {"category": "Debt Ratio", "company": 68, "industry": 52},
            {"category": "Liquidity", "company": 1.5, "industry": 1.8}
        ]
    }
    
    gst_map = {}
    if gst_bytes:
        try:
            df_gst = pd.read_csv(io.BytesIO(gst_bytes))
            for _, row in df_gst.iterrows():
                month_str = str(row.get('Month', '')).strip()
                rev = row.get('Revenue', 0)
                if pd.isna(rev): rev = 0
                gst_map[month_str] = float(rev)
        except Exception as e:
            print("GST Parse Error:", e)

    bank_map = {}
    quarterly_cash_flow = {}
    
    if bank_bytes:
        try:
            df_bank = pd.read_csv(io.BytesIO(bank_bytes))
            for _, row in df_bank.iterrows():
                month_str = str(row.get('Month', '')).strip()
                credits = pd.to_numeric(row.get('Credits', 0), errors='coerce')
                debits = pd.to_numeric(row.get('Debits', 0), errors='coerce')
                c = float(credits if pd.notna(credits) else 0)
                d = float(debits if pd.notna(debits) else 0)
                
                bank_map[month_str] = {"credits": c, "debits": d}
                
                if " " in month_str:
                    parts = month_str.split(" ", 1)
                    if len(parts) == 2:
                        m, y = parts
                        q = 1 if m in ["Jan", "Feb", "Mar"] else (2 if m in ["Apr", "May", "Jun"] else (3 if m in ["Jul", "Aug", "Sep"] else 4))
                        q_str = f"Q{q} {y}"
                        
                        if q_str not in quarterly_cash_flow:
                            quarterly_cash_flow[q_str] = {"inflow": 0, "outflow": 0}
                        quarterly_cash_flow[q_str]["inflow"] += c
                        quarterly_cash_flow[q_str]["outflow"] += d
                    
        except Exception as e:
            print("Bank Parse Error:", e)

    months_order = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
    
    all_keys = list(set(list(gst_map.keys()) + list(bank_map.keys())))
    def sort_key(s):
        parts = s.split(" ")
        m = parts[0]
        y = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 2000
        return y * 100 + months_order.get(m, 0)
        
    all_keys.sort(key=sort_key)
    
    for k in all_keys:
        chart_data["gst_vs_bank"].append({
            "month": k,
            "gstRevenue": gst_map.get(k, 0),
            "bankCredits": bank_map.get(k, {}).get("credits", 0)
        })
        
    def q_sort_key(q_str):
        parts = q_str.split(" ")
        if len(parts) == 2 and parts[1].isdigit():
            y = int(parts[1])
            q = int(parts[0].replace("Q", ""))
            return y * 10 + q
        return 0
        
    sorted_quarters = sorted(quarterly_cash_flow.keys(), key=q_sort_key)
    recent_quarters = sorted_quarters[-8:] if len(sorted_quarters) > 8 else sorted_quarters
    for q in recent_quarters:
        chart_data["cash_flow"].append({
            "quarter": q,
            "inflow": quarterly_cash_flow[q]["inflow"],
            "outflow": quarterly_cash_flow[q]["outflow"]
        })
        
    return chart_data
