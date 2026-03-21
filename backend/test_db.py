import psycopg2
import urllib.parse

password = urllib.parse.quote_plus("TryHackMe@69")
conn_str = f"postgresql://postgres:{password}@db.izazxurlbjdfbrhrbtzt.supabase.co:5432/postgres"

print("Connecting...")
try:
    conn = psycopg2.connect(conn_str)
    print("Success")
except Exception as e:
    print("Failed local connect:", e)
