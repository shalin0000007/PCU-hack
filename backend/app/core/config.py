import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY and SUPABASE_KEY != "dummy_key_if_not_set":
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        supabase = None
else:
    print("Supabase not configured - running in demo mode")
