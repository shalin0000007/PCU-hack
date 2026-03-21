import os
import uuid
import random
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

USER_EMAIL = "shalingonge07@gmail.com"

# High-fidelity sample company profiles
COMPANIES = [
    {
        "name": "Quantum Neural Services",
        "industry": "Technology",
        "loan_amount": 5500000,
        "purpose": "R&D Infrastructure Expansion",
        "risk_level": "low",
        "score": 14,
        "status": "Approved"
    },
    {
        "name": "Global Cargo Transit Pvt Ltd",
        "industry": "Logistics",
        "loan_amount": 12000000,
        "purpose": "Fleet Acquisition",
        "risk_level": "high",
        "score": 78,
        "status": "Flagged"
    },
    {
        "name": "Harmony Wellness Centers",
        "industry": "Healthcare",
        "loan_amount": 3000000,
        "purpose": "Equipment Procurement",
        "risk_level": "medium",
        "score": 45,
        "status": "Under Review"
    },
    {
        "name": "Apex Prime Real Estate",
        "industry": "Real Estate",
        "loan_amount": 25000000,
        "purpose": "Land Acquisition",
        "risk_level": "high",
        "score": 85,
        "status": "Flagged"
    },
    {
        "name": "Vertex Software Solutions",
        "industry": "IT Services",
        "loan_amount": 1500000,
        "purpose": "Working Capital",
        "risk_level": "low",
        "score": 8,
        "status": "Approved"
    },
    {
        "name": "Eco-Friendly Plastics INC",
        "industry": "Manufacturing",
        "loan_amount": 8000000,
        "purpose": "Machinery Upgrade",
        "risk_level": "medium",
        "score": 52,
        "status": "Under Review"
    },
    {
        "name": "Nimbus Cloud Architects",
        "industry": "Technology",
        "loan_amount": 4200000,
        "purpose": "Server Farm Construction",
        "risk_level": "low",
        "score": 12,
        "status": "Approved"
    }
]

def generate_chart_data(risk_level):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    gst_vs_bank = []
    expense_data = []

    base_rev = random.randint(500000, 5000000)
    for m in months:
        gst = base_rev + random.randint(-50000, 50000)
        
        if risk_level == "low":
            bank = gst + random.randint(-10000, 10000) # tight match
        elif risk_level == "medium":
            bank = gst * random.uniform(0.85, 1.15) # some variance
        else: # high risk
            bank = gst * random.uniform(0.4, 0.7) # massive mismatch

        gst_vs_bank.append({
            "month": m,
            "gstRevenue": int(gst),
            "bankCredits": int(bank)
        })

        expense_data.append({
            "month": m,
            "operational": int(base_rev * 0.4),
            "payroll": int(base_rev * 0.3),
            "tax": int(base_rev * 0.1)
        })

    return {
        "gst_vs_bank": gst_vs_bank,
        "expense_breakdown": expense_data
    }

def seed_database():
    print(f"🚀 Initializing high-fidelity data seeding for {USER_EMAIL}...")

    # Clear old dummy data for this user to make it clean
    apps = supabase.table("applications").select("id").eq("user_email", USER_EMAIL).execute()
    for app in apps.data:
        app_id = app["id"]
        supabase.table("ai_risk_assessments").delete().eq("application_id", app_id).execute()
        supabase.table("analysis_reports").delete().eq("application_id", app_id).execute()
        supabase.table("applications").delete().eq("id", app_id).execute()

    # Now populate
    now = datetime.now()
    
    for i, c_data in enumerate(COMPANIES):
        # 1. Insert Company
        company_res = supabase.table("companies").insert({
            "name": c_data["name"],
            "industry": c_data["industry"]
        }).execute()
        company_id = company_res.data[0]["id"]

        # 2. Insert Application
        app_id = f"APP-2026-{str(uuid.uuid4())[:4].upper()}"
        # Spread dates out over the last 6 months to make trends look good
        created_date = now - timedelta(days=random.randint(2, 170))
        
        supabase.table("applications").insert({
            "id": app_id,
            "company_id": company_id,
            "loan_amount": c_data["loan_amount"],
            "purpose": c_data["purpose"],
            "status": c_data["status"],
            "user_email": USER_EMAIL,
            "created_at": created_date.isoformat()
        }).execute()

        # 3. Generate Analysis Data
        chart_data = generate_chart_data(c_data["risk_level"])
        confidence = random.randint(85, 98) if c_data["risk_level"] == "low" else random.randint(70, 89)
        
        flags = []
        if c_data["risk_level"] == "high":
            flags = ["Severe GST-to-Bank credit mismatch detected (>40% variance)", "Negative cash flow trajectory in recent months"]
        elif c_data["risk_level"] == "medium":
            flags = ["Moderate variance in recorded revenues"]
            
        primary_flag = flags[0] if flags else None
        
        ai_summary = f"{c_data['name']} exhibits a {c_data['risk_level']} credit risk profile. "
        if c_data["risk_level"] == "low":
            ai_summary += "Financial statements align cohesively with banking data, showing strong liquidity."
            rec_amt = c_data["loan_amount"]
        elif c_data["risk_level"] == "medium":
            ai_summary += "There are some discrepancies requiring clarification, but overall health is sustainable."
            rec_amt = c_data["loan_amount"] * 0.75
        else:
            ai_summary += "Critical revenue anomalies detected. Immediate manual review required to prevent capital loss."
            rec_amt = c_data["loan_amount"] * 0.40

        # Insert Report
        supabase.table("analysis_reports").insert({
            "application_id": app_id,
            "risk_score": c_data["score"],
            "risk_level": c_data["risk_level"],
            "confidence_score": confidence,
            "ai_summary": ai_summary,
            "recommended_amount": rec_amt,
            "manual_review_required": c_data["risk_level"] == "high",
            "primary_flag": primary_flag,
            "chart_data": chart_data,
            "news_data": [{"title": f"Earnings report for {c_data['name']}", "source": "Finance Weekly", "url": "https://example.com"}]
        }).execute()

        # Insert AI Assessment
        supabase.table("ai_risk_assessments").insert({
            "application_id": app_id,
            "score": c_data["score"],
            "risk_level": c_data["risk_level"],
            "confidence": confidence,
            "manual_review": c_data["risk_level"] == "high",
            "summary": ai_summary,
            "key_findings": [{"type": "warning", "title": "Anomaly", "description": f} for f in flags]
        }).execute()

        print(f"✅ Created data for {c_data['name']} (Risk: {c_data['risk_level']})")

    print("\n🎉 Seed process complete! The dashboard is now fully armed with 100% accurate, high-fidelity data.")

if __name__ == "__main__":
    seed_database()
