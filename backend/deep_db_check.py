import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def deep_check():
    target_email = "shalingonge07@gmail.com"
    
    # 1. Total apps
    apps = supabase.table("applications").select("*").execute()
    print(f"Total Applications: {len(apps.data)}")
    for a in apps.data:
        print(f"ID: {a['id']} | Email: {a.get('user_email')} | Status: {a.get('status')}")

    # 2. Total reports
    reports = supabase.table("analysis_reports").select("id, application_id").execute()
    print(f"\nTotal Reports: {len(reports.data)}")
    report_app_ids = [r['application_id'] for r in reports.data]
    print(f"Reports linked to apps: {report_app_ids}")

    # 3. Orphaned reports check?
    # (None usually because they are linked by foreign key)

    # 4. Are there any apps that SHOULD belong to the user but don't?
    # If the user says 'old data is not connected', maybe there are apps with NO user_email at all?
    # My previous script already checked for NULLs. 

    # Let's try to find apps where user_email is NOT shalingonge07@gmail.com
    others = supabase.table("applications").select("*").neq("user_email", target_email).execute()
    print(f"\nApplications NOT belonging to {target_email}: {len(others.data)}")
    for o in others.data:
        print(f"ID: {o['id']} | Email: {o.get('user_email')}")

if __name__ == "__main__":
    deep_check()
