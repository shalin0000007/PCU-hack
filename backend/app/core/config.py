import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://gzdrfihkqjdffojuwcmm.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "dummy_key_if_not_set")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None
