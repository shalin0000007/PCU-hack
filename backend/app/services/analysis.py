import pandas as pd
import io

HIGH_RISK_INDUSTRIES = {"Construction", "Agriculture", "Mining", "Real Estate"}
MEDIUM_RISK_INDUSTRIES = {"Retail", "Hospitality", "Manufacturing"}

def calculate_risk_score(loan_amount: float, industry: str, chart_data: dict = None) -> tuple[int, str, list]:
    """
    Deterministic risk score generation using actual financial data.
    Returns: (score 0-100, risk_level, flags)
    Higher score = safer / lower risk.
    """
    score = 75  # Baseline: reasonably healthy company
    flags = []

    if not chart_data:
        # No financial data uploaded — can only assess on loan amount & industry
        score = 60
        flags.append("No financial documents uploaded for analysis")
        if industry in HIGH_RISK_INDUSTRIES:
            score -= 5
            flags.append(f"Industry '{industry}' carries elevated risk")
        risk_level = _score_to_level(score)
        return max(0, min(100, score)), risk_level, flags

    # --- 1. GST vs Bank Mismatch (up to -25 pts) ---
    gst_bank = chart_data.get("gst_vs_bank", [])
    total_gst = sum(d.get("gstRevenue", d.get("gst", 0)) for d in gst_bank)
    total_bank = sum(d.get("bankCredits", d.get("bank", 0)) for d in gst_bank)

    if total_gst > 0:
        mismatch_pct = abs(total_gst - total_bank) / total_gst * 100
    elif total_bank > 0:
        mismatch_pct = 100
    else:
        mismatch_pct = 0

    if mismatch_pct > 25:
        score -= 25
        flags.append(f"Critical revenue mismatch: {mismatch_pct:.1f}% difference between GST and bank records")
    elif mismatch_pct > 15:
        score -= 15
        flags.append(f"Significant revenue mismatch: {mismatch_pct:.1f}% difference between GST and bank records")
    elif mismatch_pct > 5:
        score -= 5
        flags.append(f"Minor revenue mismatch: {mismatch_pct:.1f}% difference between GST and bank records")

    # --- 2. Cash Flow Health (up to -20 pts) ---
    cash_flow = chart_data.get("cash_flow", [])
    total_inflow = sum(d.get("inflow", 0) for d in cash_flow)
    total_outflow = sum(d.get("outflow", 0) for d in cash_flow)

    if total_inflow > 0:
        outflow_ratio = total_outflow / total_inflow
        if outflow_ratio > 1.0:
            score -= 20
            flags.append("Cash outflow exceeds inflow — negative cash position")
        elif outflow_ratio > 0.95:
            score -= 10
            flags.append("Very tight cash flow margin (outflow > 95% of inflow)")
        elif outflow_ratio > 0.85:
            score -= 5
            flags.append("Cash flow margin is moderate")

    # --- 3. Loan-to-Revenue Ratio (up to -15 pts) ---
    annual_revenue = total_gst if total_gst > 0 else total_bank
    if annual_revenue > 0:
        loan_ratio = loan_amount / annual_revenue
        if loan_ratio > 0.8:
            score -= 15
            flags.append(f"Loan amount is {loan_ratio:.0%} of total recorded revenue — very high exposure")
        elif loan_ratio > 0.5:
            score -= 10
            flags.append(f"Loan amount is {loan_ratio:.0%} of total recorded revenue — elevated exposure")
        elif loan_ratio > 0.3:
            score -= 5
    else:
        score -= 10
        flags.append("No revenue data available to assess loan exposure")

    # --- 4. Revenue Trend (±10 pts) ---
    if len(gst_bank) >= 6:
        mid = len(gst_bank) // 2
        older_avg = sum(d.get("gstRevenue", d.get("gst", 0)) for d in gst_bank[:mid]) / mid
        recent_avg = sum(d.get("gstRevenue", d.get("gst", 0)) for d in gst_bank[mid:]) / (len(gst_bank) - mid)
        if older_avg > 0:
            growth = (recent_avg - older_avg) / older_avg * 100
            if growth > 15:
                score += 10
            elif growth > 5:
                score += 5
            elif growth < -15:
                score -= 10
                flags.append(f"Revenue declining: {growth:.1f}% drop in recent period")
            elif growth < -5:
                score -= 5
                flags.append(f"Slight revenue decline: {growth:.1f}%")

    # --- 5. Industry Risk Modifier (±5 pts) ---
    if industry in HIGH_RISK_INDUSTRIES:
        score -= 5
        flags.append(f"Industry '{industry}' carries elevated default risk")
    elif industry in MEDIUM_RISK_INDUSTRIES:
        score -= 2

    # Clamp to 0-100
    score = max(0, min(100, score))
    risk_level = _score_to_level(score)
    return score, risk_level, flags


def _score_to_level(score: int) -> str:
    if score >= 70:
        return "low"
    elif score >= 45:
        return "medium"
    else:
        return "high"

def parse_financial_files(gst_bytes: bytes, bank_bytes: bytes, industry: str = "General"):
    chart_data = {
        "gst_vs_bank": [],
        "cash_flow": [],
        "industry_insights": []
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
    
    # --- Compute Industry Insights from real data ---
    total_inflow = sum(v["credits"] for v in bank_map.values()) if bank_map else 0
    total_outflow = sum(v["debits"] for v in bank_map.values()) if bank_map else 0
    
    # Company metrics (computed from actual data)
    if total_inflow > 0:
        company_profit_margin = round((total_inflow - total_outflow) / total_inflow * 100, 1)
        company_debt_ratio = round(total_outflow / total_inflow * 100, 1)
    else:
        company_profit_margin = 0
        company_debt_ratio = 0
    
    # Liquidity = avg of last 3 months inflow / outflow
    recent_months = list(bank_map.values())[-3:] if len(bank_map) >= 3 else list(bank_map.values())
    if recent_months:
        recent_inflow = sum(m["credits"] for m in recent_months)
        recent_outflow = sum(m["debits"] for m in recent_months)
        company_liquidity = round(recent_inflow / recent_outflow, 2) if recent_outflow > 0 else 0
    else:
        company_liquidity = 0
    
    # Industry benchmark averages (per sector)
    industry_benchmarks = {
        "Information Technology": {"profit_margin": 18, "debt_ratio": 45, "liquidity": 2.1},
        "Manufacturing": {"profit_margin": 12, "debt_ratio": 58, "liquidity": 1.6},
        "Retail": {"profit_margin": 8, "debt_ratio": 62, "liquidity": 1.4},
        "Construction": {"profit_margin": 10, "debt_ratio": 70, "liquidity": 1.2},
        "Agriculture": {"profit_margin": 7, "debt_ratio": 55, "liquidity": 1.3},
        "Hospitality": {"profit_margin": 14, "debt_ratio": 60, "liquidity": 1.5},
        "Real Estate": {"profit_margin": 15, "debt_ratio": 72, "liquidity": 1.1},
        "Mining": {"profit_margin": 16, "debt_ratio": 50, "liquidity": 1.7},
        "Healthcare": {"profit_margin": 13, "debt_ratio": 48, "liquidity": 1.9},
        "Finance": {"profit_margin": 20, "debt_ratio": 65, "liquidity": 1.8},
    }
    benchmarks = industry_benchmarks.get(industry, {"profit_margin": 15, "debt_ratio": 52, "liquidity": 1.8})
    
    chart_data["industry_insights"] = [
        {"category": "Profit Margin", "company": company_profit_margin, "industry": benchmarks["profit_margin"]},
        {"category": "Debt Ratio", "company": company_debt_ratio, "industry": benchmarks["debt_ratio"]},
        {"category": "Liquidity", "company": company_liquidity, "industry": benchmarks["liquidity"]}
    ]
        
    return chart_data
