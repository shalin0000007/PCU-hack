from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Intelli-Credit AI Backend")

# Keep CORS completely open for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.routes import router as api_router

@app.get("/")
def read_root():
    return {"message": "Welcome to Intelli-Credit AI Backend!"}

app.include_router(api_router, prefix="/api")
