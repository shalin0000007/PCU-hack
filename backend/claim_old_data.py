import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def claim_data():
    target_email = "shalingonge07@gmail.com"
    
    # 1. First, list all unique user_emails current in system
    all_data = supabase.table("applications").select("user_email").execute()
    emails = [row.get("user_email") for row in all_data.data]
    print(f"📊 Current Total Applications: {len(emails)}")
    print(f"📧 Unique user_emails found: {list(set(emails))}")

    # 2. Update NULLs
    res = supabase.table("applications").update({"user_email": target_email}).is_("user_email", "null").execute()
    updated = len(res.data) if res.data else 0
    print(f"✅ Claimed {updated} applications for {target_email}.")

    # 3. Handle cases where user_email might be empty string
    res_empty = supabase.table("applications").update({"user_email": target_email}).eq("user_email", "").execute()
    updated_empty = len(res_empty.data) if res_empty.data else 0
    if updated_empty > 0:
        print(f"✅ Claimed {updated_empty} empty-string applications for {target_email}.")

if __name__ == "__main__":
    claim_data()
