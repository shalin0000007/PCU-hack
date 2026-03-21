with open("app/api/routes.py", "r") as f:
    text = f.read()

text = text.replace(
'''        except Exception as sqlite_error:
            print("SQLite fallback failed:", sqlite_error)
            raise HTTPException(status_code=500, detail="Internal server error linking databases")''',
'''        except HTTPException as h:
            raise h
        except Exception as sqlite_error:
            print("SQLite fallback failed:", sqlite_error)
            raise HTTPException(status_code=500, detail="Internal server error linking databases")'''
)
with open("app/api/routes.py", "w") as f:
    f.write(text)
