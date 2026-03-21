# 📊 Intelli-Credit AI

> AI-Powered Credit Risk Analysis Platform for Banks & Financial Institutions

![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-orange) ![AI](https://img.shields.io/badge/AI-Powered-purple)

## 🚀 Overview

**Intelli-Credit AI** is a comprehensive credit risk assessment platform that leverages artificial intelligence to analyze company financials, detect anomalies, and provide data-driven loan recommendations. Built for the PCU Hackathon, it automates the traditionally manual credit underwriting process.

## ✨ Features

### 🔐 Authentication
- Secure login with credential validation
- Session persistence with localStorage
- Auth guard on all protected routes

### 📊 Dynamic Dashboard
- **Real-time statistics** — Total applications, high-risk cases, approval rates
- **Risk distribution charts** — Live donut chart from Supabase data
- **Dynamic alerts** — Auto-generated from real portfolio data (not hardcoded)
- **Filter & Sort** — Filter by risk level, sort by date/score/company/amount

### 🏢 Company Analysis
- **12 real Indian companies** seeded — TCS, Infosys, Reliance, HDFC, L&T, Godrej, Adani, etc.
- **GST vs Bank Revenue** trend analysis with year filters
- **Cash Flow Analysis** with quarterly inflow/outflow charts
- **Industry Peer Comparison** via radar and bar charts
- **Live News Integration** — Fetches real-time news for each company

### 🤖 AI-Powered Features
- **Context-Aware AI Chatbot** — Has full visibility into all 12 portfolio companies, their risk scores, financial metrics, and AI summaries
- **AI Risk Assessment** — Automated risk scoring with key findings
- **AI Summary Generation** — Detailed explanations of risk factors
- **Smart Suggested Queries** — "Which companies are high risk?", "Compare TCS and Infosys"

### 📄 Report Generation
- **Detailed Analysis Pages** — Risk score, AI summary, key findings, financial charts
- **PDF/HTML Reports** — Professional downloadable reports with company data
- **Report Preview** — In-app report viewer with integrated AI chat

### 📝 Application Management
- **New Application Form** — Company details, loan amount, GST/Bank file uploads
- **External Data Fetch** — Fetch live news data for any company
- **Application History** — Search, filter, and manage all applications
- **Delete with Cascade** — Removes all related records (assessments, reports)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Recharts, Framer Motion |
| **Backend** | FastAPI (Python), Uvicorn |
| **Database** | Supabase (PostgreSQL) |
| **AI Engine** | OpenAI-compatible API (configurable) |
| **Styling** | Tailwind CSS with custom design system |

## 📁 Project Structure

```
PCU_hack/
├── src/                          # Frontend (React + TypeScript)
│   └── app/
│       ├── components/           # Layout, AIChatbot
│       ├── contexts/             # ThemeContext (dark mode)
│       ├── pages/                # All page components
│       │   ├── Login.tsx
│       │   ├── Dashboard.tsx
│       │   ├── NewApplication.tsx
│       │   ├── AnalysisProcess.tsx
│       │   ├── CreditRiskAnalysis.tsx
│       │   ├── ReportPreview.tsx
│       │   ├── History.tsx
│       │   └── Settings.tsx
│       └── routes.ts
├── backend/                      # Backend (FastAPI)
│   ├── main.py                   # FastAPI app entry
│   ├── app/
│   │   ├── api/routes.py         # All API endpoints
│   │   └── services/
│   │       ├── ai_service.py     # AI chatbot & analysis
│   │       ├── analysis.py       # Risk analysis engine
│   │       └── news_service.py   # Live news fetcher
│   ├── .env                      # API keys (not in git)
│   └── setup_db.py               # Database seeder
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase account

### 1. Frontend Setup
```bash
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Create .env file
echo SUPABASE_URL=your_url > .env
echo SUPABASE_KEY=your_key >> .env
echo AI_API_KEY=your_key >> .env

python -m uvicorn main:app --reload --port 8000
```

### 3. Database Setup
```bash
cd backend
python setup_db.py          # Seeds 12 real Indian companies
```

### Default Login Credentials
| Username | Password |
|----------|----------|
| admin | admin123 |
| rajesh | credit2026 |
| officer | intelli |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard-stats` | Dashboard statistics |
| GET | `/api/applications` | All applications with risk data |
| DELETE | `/api/applications/{id}` | Delete application (cascade) |
| POST | `/api/analyze` | Start new analysis |
| GET | `/api/analysis/{id}` | Get analysis report |
| GET | `/api/ai-assessment/{id}` | Get AI risk assessment |
| POST | `/api/chat` | AI chatbot (portfolio-aware) |
| POST | `/api/chat/{id}` | AI chatbot (report-specific) |
| GET | `/api/news?company=X` | Fetch live news |
| GET | `/api/report/{id}/pdf` | Download HTML report |

## 🎨 Design Highlights

- **Glassmorphism** login page with animated background
- **Dark mode** with system-aware toggle
- **Smooth transitions** via Framer Motion
- **Responsive charts** with Recharts
- **Premium color palette** — Emerald green (#00b386) primary

## 👥 Team

Built for the **PCU Hackathon 2026** by Team Intelli-Credit.

## 📄 License

This project is built for educational and hackathon purposes.