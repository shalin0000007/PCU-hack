with open("app/api/routes.py", "r") as f:
    content = f.read()

new_content = content.replace(
    "from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse",
    "from app.models.schemas import ApplicationResponse, AnalysisRequest, AnalysisReportResponse, LoginRequest, LoginResponse\nimport psycopg2\nimport urllib.parse\nimport sqlite3\nfrom fastapi import status, HTTPException\nDB_CONN_STR = 'postgresql://postgres:' + urllib.parse.quote_plus('TryHackMe@69') + '@db.izazxurlbjdfbrhrbtzt.supabase.co:5432/postgres'"
)

route_add = """

def init_supabase_db():
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
        print("Supabase DB Init Error:", e)

def get_sqlite_conn():
    conn = sqlite3.connect("fallback_users.db")
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS app_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user'
        )
    ''')
    conn.commit()
    return conn

# Run init once
init_supabase_db()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    # Static checking for Admin sample credentials
    if request.username == "Admin":
        if request.password == "Admin@123":
            return {"username": "Admin", "role": "admin", "message": "Login successful"}
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Admin credentials")
            
    # Attempt connecting to Supabase database
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
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials for existing user")
        else:
            # Create new user
            cur.execute("INSERT INTO app_users (username, password, role) VALUES (%s, %s, 'user') RETURNING role", (request.username, request.password))
            role = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {"username": request.username, "role": role, "message": "User created and logged in"}
            
    except psycopg2.Error as e:
        print(f"Supabase error, using SQLite Fallback. Reason: {e}")
        # Supabase unavailable (IPv6 block etc.), use local SQLite fallback
        try:
            sl_conn = get_sqlite_conn()
            cur = sl_conn.cursor()
            cur.execute("SELECT password, role FROM app_users WHERE username = ?", (request.username,))
            user = cur.fetchone()
            
            if user:
                if user[0] == request.password:
                    role = user[1]
                    cur.close()
                    sl_conn.close()
                    return {"username": request.username, "role": role, "message": "Login successful (fallback)"}
                else:
                    cur.close()
                    sl_conn.close()
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            else:
                cur.execute("INSERT INTO app_users (username, password, role) VALUES (?, ?, 'user')", (request.username, request.password))
                sl_conn.commit()
                cur.close()
                sl_conn.close()
                return {"username": request.username, "role": "user", "message": "User created in fallback DB"}
        except Exception as sqlite_error:
            print("SQLite fallback failed:", sqlite_error)
            raise HTTPException(status_code=500, detail="Internal server error linking databases")

"""

with open("app/api/routes.py", "w") as f:
    f.write(new_content + route_add)

