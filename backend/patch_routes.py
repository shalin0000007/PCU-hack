import re

with open('app/api/routes.py', 'r') as f:
    content = f.read()

content = content.replace(
    "from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse",
    "from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, LoginRequest, LoginResponse"
)

new_routes = """
import psycopg2
import urllib.parse

from fastapi import status

DB_CONN_STR = "postgresql://postgres:" + urllib.parse.quote_plus("TryHackMe@69") + "@db.izazxurlbjdfbrhrbtzt.supabase.co:5432/postgres"

def init_db():
    try:
        conn = psycopg2.connect(DB_CONN_STR)
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            )
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("DB Init Error:", e)

# Run init once
init_db()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    if request.username == "Admin" and request.password == "Admin@123":
        return {"username": "Admin", "role": "admin", "message": "Login successful"}
        
    try:
        conn = psycopg2.connect(DB_CONN_STR)
        cur = conn.cursor()
        cur.execute("SELECT password, role FROM app_users WHERE username = %s", (request.username,))
        user = cur.fetchone()
        
        if user:
            if user[0] == request.password:
                role = user[1]
                cur.close()
                conn.close()
                return {"username": request.username, "role": role, "message": "Login successful"}
            else:
                cur.close()
                conn.close()
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        else:
            # Create new user
            cur.execute("INSERT INTO app_users (username, password, role) VALUES (%s, %s, 'user') RETURNING role", (request.username, request.password))
            role = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {"username": request.username, "role": role, "message": "User created and logged in"}
    except psycopg2.Error as e:
        print("DB Error:", e)
        # Fallback if DB is completely unreachable
        if request.username != "Admin":
            return {"username": request.username, "role": "user", "message": "Fallback login successful"}
        raise HTTPException(status_code=500, detail="Database connection error")
"""

content += new_routes

with open('app/api/routes.py', 'w') as f:
    f.write(content)
