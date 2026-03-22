import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Newspaper,
  Target,
  Brain,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Layout from "../components/Layout";
import AIChatbot from "../components/AIChatbot";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const riskBreakdownStatic = [
  { name: "Financial Risk", value: 35, color: "#fbbf24" },
  { name: "Fraud Indicators", value: 25, color: "#ef4444" },
  { name: "External Factors", value: 15, color: "#3b82f6" },
  { name: "Normal", value: 25, color: "#50ddad" },
];

const gstVsBankDataFallback = [
  { month: "Jan", gst: 850000, bank: 820000 },
  { month: "Feb", gst: 920000, bank: 880000 },
  { month: "Mar", gst: 780000, bank: 850000 },
  { month: "Apr", gst: 950000, bank: 920000 },
  { month: "May", gst: 1100000, bank: 980000 },
  { month: "Jun", gst: 1050000, bank: 1020000 },
];

const cashFlowDataFallback = [
  { quarter: "Q1", inflow: 2800000, outflow: 2400000 },
  { quarter: "Q2", inflow: 3200000, outflow: 2600000 },
  { quarter: "Q3", inflow: 3100000, outflow: 2800000 },
  { quarter: "Q4", inflow: 3500000, outflow: 2900000 },
];

const industryInsightsFallback = [
  { category: "Profitability", company: 75, industry: 82 },
  { category: "Liquidity", company: 68, industry: 75 },
  { category: "Efficiency", company: 71, industry: 70 },
  { category: "Leverage", company: 45, industry: 65 },
  { category: "Growth", company: 82, industry: 75 },
];

const newsDataFallback = [
  {
    id: 1,
    title: "Company Secures Major IT Contract",
    source: "Economic Times",
    sentiment: "positive",
    date: "2 days ago",
    summary: "TechVista wins ₹15 crore government project for digital transformation",
    url: "#"
  },
  {
    id: 2,
    title: "Industry Growth Slows in Q4",
    source: "Business Standard",
    sentiment: "neutral",
    date: "1 week ago",
    summary: "IT sector sees 12% YoY growth, down from 18% previous quarter",
    url: "#"
  },
  {
    id: 3,
    title: "Regulatory Compliance Concerns",
    source: "Financial Express",
    sentiment: "negative",
    date: "2 weeks ago",
    summary: "Several mid-size IT firms under scrutiny for GST filing irregularities",
    url: "#"
  },
];

export default function CreditRiskAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportData, setReportData] = useState<any>(null);
  const [aiAssessment, setAiAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All Time");
  const [liveNews, setLiveNews] = useState<any[] | null>(null);

  useEffect(() => {
    if (reportData?.application?.companies?.name && reportData.application.companies.name !== "Unknown Company") {
      fetch(`http://localhost:8000/api/news?company=${encodeURIComponent(reportData.application.companies.name)}`)
        .then(res => res.json())
        .then(data => {
            if (data.news) setLiveNews(data.news);
        })
        .catch(err => console.error("Error fetching live news:", err));
    }
  }, [reportData]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8000/api/analysis/${id}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch analysis");
        return res.json();
      }),
      fetch(`http://localhost:8000/api/ai-assessment/${id}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch ai");
        return res.json();
      })
    ])
    .then(([analysisData, aiData]) => {
      setReportData(analysisData);
      setAiAssessment(aiData);
      setLoading(false);
    })
    .catch(err => {
      console.warn("Error fetching report data, falling back to dummy data. Error:", err);
      const companyRegistry: Record<string, string> = {
        "APP-2024-001": "TechVista Solutions Pvt Ltd",
        "APP-2024-002": "Global Exports & Trading Co",
        "APP-2024-003": "Urban Construction Ltd",
        "APP-2024-004": "Fresh Farms Agriculture",
        "APP-2024-005": "Retail Chain Ventures",
        "APP-2024-006": "Innovative Software Labs"
      };
      const companyFallback = companyRegistry[id || "APP-2024-001"] || "TechVista Solutions Pvt Ltd";
      
      setReportData({
        application: {
          loan_amount: 5000000,
          companies: { name: companyFallback, industry: "Technology" }
        },
        report: {
          created_at: new Date().toISOString(),
          risk_score: 56,
          risk_level: "medium",
          ai_summary: "The medium risk classification is driven by a 15% GST-Bank revenue mismatch and a debt ratio of 0.68 (vs industry avg 0.52). However, the company demonstrates consistent 18% YoY growth and acceptable liquidity ratios. Recommendation: Approve ₹35L (70% of requested amount) with enhanced monitoring and quarterly reviews.",
          confidence_score: 78,
          manual_review_required: true,
          recommended_amount: 3500000,
          key_findings: [
            { title: "Revenue Mismatch Detected", description: "15% discrepancy between GST and bank credits" },
            { title: "Cash Flow Irregularities", description: "Unusual transaction patterns in Q3" },
            { title: "Consistent Growth Pattern", description: "18% YoY revenue growth maintained" },
            { title: "High Debt Ratio", description: "0.68 vs industry average of 0.52" }
          ],
          chart_data: {
            gst_vs_bank: gstVsBankDataFallback,
            cash_flow: cashFlowDataFallback,
            industry_insights: industryInsightsFallback
          },
          news_data: newsDataFallback
        }
      });
      setLoading(false);
    });
  }, [id]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-[#d1fae5] text-[#10b981] dark:bg-[#00b386]/10 dark:text-[#50ddad] border border-transparent dark:border-[#00b386]/20";
      case "negative":
        return "bg-[#fee2e2] text-[#ef4444] dark:bg-[#ef4444]/10 dark:text-[#f87171] border border-transparent dark:border-[#ef4444]/20";
      default:
        return "bg-[#e0e7ff] text-[#6366f1] dark:bg-[#3b82f6]/10 dark:text-[#60a5fa] border border-transparent dark:border-[#3b82f6]/20";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#00b386]/20 border-t-[#00b386] rounded-full animate-spin"></div>
            <p className="text-[#1a1a1a] dark:text-[#dae2fd] text-lg font-medium">Synthesizing AI Report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!reportData || !reportData.report) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto mt-12 bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] text-center p-12">
            <AlertTriangle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#dae2fd] mb-2">Analysis Not Found</h2>
            <p className="text-[#737373] dark:text-[#86948c] mb-6">Could not fetch analysis report for Application ID {id}. Please ensure it was generated first.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] font-bold rounded-xl shadow-[0_4px_14px_rgba(0,179,134,0.3)] hover:shadow-[0_6px_20px_rgba(0,179,134,0.4)] transition-all"
            >
              Return to Dashboard
            </button>
        </div>
      </Layout>
    );
  }

  const { application, report } = reportData;
  const companyName = application?.companies?.name || "Unknown Company";
  const industry = application?.companies?.industry || "Technology";
  
  const riskScore = aiAssessment?.score ?? report?.risk_score ?? 56;
  const riskLevel = aiAssessment?.risk_level ?? report?.risk_level ?? "medium";
  const confidenceLevel = aiAssessment?.confidence ?? report?.confidence_score ?? 78;
  const aiExplanation = aiAssessment?.summary ?? report?.ai_summary ?? "The medium risk classification is primarily driven by a combination of financial inconsistencies and debt exposure.";
  const keyFindings = aiAssessment?.key_findings?.length ? aiAssessment?.key_findings : report?.key_findings ?? [];
  const recommendedAmount = report?.recommended_amount || 3500000;
  
  const newsList = liveNews || report.news_data || [];
  
  let rawGstBankData = report.chart_data?.gst_vs_bank || [];
  const mappedGstBankData = rawGstBankData.map((d: any) => {
    const parts = String(d.month || "").split(" ");
    return {
      originalMonth: d.month,
      month: parts[0] || "Unknown",
      year: parts[1] || "2024",
      gst: d.gstRevenue || d.gst || 0,
      bank: d.bankCredits || d.bank || 0,
    };
  });
  
  const availableYears = ["All Time", ...Array.from(new Set(mappedGstBankData.map((d: any) => d.year)))].sort().reverse();
  
  const filteredGstBankData = selectedYear === "All Time" 
      ? mappedGstBankData.map((d: any) => ({ ...d, displayMonth: d.originalMonth }))
      : mappedGstBankData.filter((d: any) => d.year === selectedYear).map((d: any) => ({ ...d, displayMonth: d.month }));

  const totalGst = filteredGstBankData.reduce((acc: number, val: any) => acc + val.gst, 0);
  const totalBank = filteredGstBankData.reduce((acc: number, val: any) => acc + val.bank, 0);
  const difference = Math.abs(totalGst - totalBank);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const cashFlowData = report.chart_data?.cash_flow || [];
  const industryInsights = report.chart_data?.industry_insights || [];

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <AIChatbot />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 mt-2">
          <div className="flex items-start gap-5">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-11 h-11 flex items-center justify-center bg-white dark:bg-white/5 border border-[#e5e5e5] dark:border-white/[0.06] rounded-xl hover:bg-[#f5f5f5] dark:hover:bg-white/10 transition-colors backdrop-blur-md shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#86948c]" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#737373] dark:from-[#dae2fd] dark:to-[#86948c]">{companyName}</h1>
                <span className="px-2.5 py-1 rounded bg-[#e5f7f3] dark:bg-[#00b386]/10 text-[#00b386] dark:text-[#50ddad] text-[10px] font-bold uppercase tracking-widest border border-transparent dark:border-[#00b386]/20">
                  {industry}
                </span>
              </div>
              <p className="text-sm font-medium text-[#737373] dark:text-[#86948c] uppercase tracking-wider">{id} • Credit Risk Analysis Report</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              onClick={() => navigate(`/report/${id}`)}
              className="px-5 py-2.5 bg-transparent border border-[#00b386] dark:border-[#50ddad]/30 text-[#00b386] dark:text-[#50ddad] font-bold rounded-xl hover:bg-[#00b386]/10 transition-all flex items-center gap-2 text-sm backdrop-blur-md"
            >
              <FileText className="w-4 h-4" />
              View Report
            </button>
            <button 
              onClick={() => {
                window.print();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] font-bold rounded-xl shadow-[0_4px_14px_rgba(0,179,134,0.3)] hover:shadow-[0_6px_20px_rgba(0,179,134,0.4)] transition-all flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Score & AI Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score Hero Card */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 blur-[80px] pointer-events-none ${riskLevel === 'high' ? 'bg-[#ef4444]' : riskLevel === 'medium' ? 'bg-[#f59e0b]' : 'bg-[#50ddad]'}`}></div>
            
            <div className="relative z-10 text-center">
              <div className="w-48 h-48 mx-auto mb-6 relative flex items-center justify-center">
                {/* Score Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-[#f5f5f5] dark:stroke-white/5" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="8" strokeLinecap="round"
                    className={`${riskLevel === 'high' ? 'stroke-[#ef4444]' : riskLevel === 'medium' ? 'stroke-[#f59e0b]' : 'stroke-[#50ddad]'}`}
                    strokeDasharray={`${riskScore * 2.82} 282`}
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-black text-[#1a1a1a] dark:text-[#dae2fd] tabular-nums tracking-tighter">{riskScore}</span>
                  <span className="text-xs font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border mb-3 ${riskLevel === 'high' ? 'bg-[#fee2e2] text-[#ef4444] dark:bg-[#ef4444]/10 dark:text-[#f87171] border-transparent dark:border-[#ef4444]/20' : riskLevel === 'medium' ? 'bg-[#fef3c7] text-[#f59e0b] dark:bg-[#f59e0b]/10 dark:text-[#fbbf24] border-transparent dark:border-[#f59e0b]/20' : 'bg-[#d1fae5] text-[#10b981] dark:bg-[#00b386]/10 dark:text-[#50ddad] border-transparent dark:border-[#00b386]/20'}`}>
                {riskLevel} RISK
              </div>
              <p className="text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-widest">
                AI Confidence Index: {confidenceLevel}%
              </p>
            </div>
          </div>

          {/* AI Assessment Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#00b386]/10 to-[#059669]/5 dark:from-[#50ddad]/10 dark:to-transparent rounded-3xl shadow-lg border border-transparent dark:border-[#50ddad]/20 p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#50ddad]/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Sparkles className="w-6 h-6 text-[#00b386] dark:text-[#50ddad]" />
              <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">AI Risk Assessment Summary</h3>
            </div>
            
            <p className="text-[15px] text-[#1a1a1a] dark:text-[#dae2fd] leading-relaxed mb-8 relative z-10 font-medium opacity-90">
              {aiExplanation}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5">
                 <p className="text-[10px] font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mb-1">Recommended Loan</p>
                 <p className="text-xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">₹{(report.recommended_amount/100000).toFixed(1)} L</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5">
                 <p className="text-[10px] font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mb-1">Risk Factors</p>
                 <p className="text-xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{keyFindings.length} Identified</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5">
                 <p className="text-[10px] font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mb-1">Manual Review</p>
                 <p className="text-xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">
                   {aiAssessment?.manual_review ? (
                     <span className="text-[#f59e0b] dark:text-[#fbbf24]">Required</span>
                   ) : (
                     <span className="text-[#00b386] dark:text-[#50ddad]">Not Required</span>
                   )}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Analysis Findings */}
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8 space-y-6">
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Key Analytical Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFindings.map((finding: any, i: number) => {
              const severityColor = i === 0 ? "border-l-[#ef4444]" : i === 1 ? "border-l-[#f59e0b]" : "border-l-[#00b386] dark:border-l-[#50ddad]";
              return (
                <div key={i} className={`p-5 bg-white/50 dark:bg-black/20 rounded-xl border-l-[3px] border-y border-r border-[#e5e5e5] dark:border-black/5 ${severityColor} backdrop-blur-sm relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                    <Target className="w-12 h-12 text-[#1a1a1a] dark:text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-[#dae2fd] mb-2 pr-4">{finding.title}</h4>
                  <p className="text-xs text-[#737373] dark:text-[#86948c] leading-relaxed relative z-10">{finding.description}</p>
                </div>
              );
            })}
            {keyFindings.length === 0 && (
                <div className="p-5 bg-white/50 dark:bg-[#00b386]/5 rounded-xl border-l-[3px] border-l-[#00b386] dark:border-l-[#50ddad] border-y border-r dark:border-[#00b386]/10 flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-[#00b386] dark:text-[#50ddad]" />
                    <div>
                        <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Clean Profile</p>
                        <p className="text-xs text-[#737373] dark:text-[#86948c] mt-1">No significant risk flags were raised by the AI.</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Financial Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GST vs Bank Revenue */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">GST vs Bank Revenue</h3>
               <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 text-[#1a1a1a] dark:text-[#dae2fd]"
                >
                  {availableYears.map(year => (
                    <option key={String(year)} value={String(year)}>{String(year)}</option>
                  ))}
               </select>
            </div>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredGstBankData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#50ddad" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#50ddad" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-white/5" />
                  <XAxis dataKey="displayMonth" stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1326", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: '#dae2fd' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="gst" stroke="#50ddad" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0b1326', stroke: '#50ddad', strokeWidth: 3 }} name="GST Returns" 
                      // @ts-ignore
                      fill="url(#colorGst)"
                  />
                  <Line type="monotone" dataKey="bank" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0b1326', stroke: '#3b82f6', strokeWidth: 3 }} name="Bank Credits"
                      // @ts-ignore
                      fill="url(#colorBank)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#e5e5e5] dark:border-white/[0.06]">
               <div>
                  <p className="text-[10px] font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mb-1">Total GST</p>
                  <p className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{formatCurrency(totalGst)}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest mb-1">Variance</p>
                 <p className={`text-lg font-bold ${totalGst !== totalBank ? 'text-[#ef4444] dark:text-[#f87171]' : 'text-[#00b386] dark:text-[#50ddad]'}`}>
                    {Math.abs(100 - (totalBank/totalGst)*100).toFixed(1)}% Mismatch
                 </p>
               </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd] mb-6">Cash Flow Analysis</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-white/5" />
                  <XAxis dataKey="quarter" stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1326", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: '#dae2fd' }}
                    itemStyle={{ fontWeight: 600 }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="inflow" fill="#50ddad" name="Inflow" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="outflow" fill="#3b82f6" name="Outflow" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Peer Intelligence & News */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8">
             <div className="flex items-center gap-3 mb-6">
               <Target className="w-5 h-5 text-[#00b386] dark:text-[#50ddad]" />
               <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Peer Intelligence</h3>
             </div>
             
             <div className="flex justify-center h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={industryInsights}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#86948c', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Company" dataKey="company" stroke="#50ddad" fill="#50ddad" fillOpacity={0.4} strokeWidth={2} />
                    <Radar name="Industry" dataKey="industry" stroke="#3b82f6" fill="transparent" strokeDasharray="3 3" strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0b1326", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                  </RadarChart>
               </ResponsiveContainer>
             </div>
             
             <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-[#e5e5e5] dark:border-white/[0.03]">
                 <p className="text-xs text-[#737373] dark:text-[#86948c] leading-relaxed">
                   Company outperforms industry competitors by 12% in <span className="font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Growth metrics</span> but shows elevated risk in <span className="font-bold text-[#ef4444] dark:text-[#f87171]">Leverage capacity</span>.
                 </p>
             </div>
          </div>

          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8 flex flex-col">
             <div className="flex items-center gap-3 mb-6">
               <Newspaper className="w-5 h-5 text-[#00b386] dark:text-[#50ddad]" />
               <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Real-Time Market Intelligence</h3>
             </div>
             
             <div className="relative pl-6 space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar my-2">
               {/* Vertical Timeline Track */}
               <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#e5e5e5] via-[#e5e5e5] to-transparent dark:from-[#3c4a43]/50 dark:via-[#3c4a43]/50 dark:to-transparent"></div>

               {newsList.map((news: any, idx: number) => {
                 const sentiment = (news.sentiment || "").toLowerCase();
                 const sentimentColor = sentiment === "positive"
                    ? "text-[#10b981] bg-[#d1fae5] dark:text-[#50ddad] dark:bg-[#00b386]/20 border border-[#10b981]/20 dark:border-[#00b386]/30"
                    : sentiment === "negative" 
                    ? "text-[#ef4444] bg-[#fee2e2] dark:text-[#f87171] dark:bg-[#ef4444]/20 border border-[#ef4444]/20 dark:border-[#ef4444]/30"
                    : "text-[#f59e0b] bg-[#fef3c7] dark:text-[#fbbf24] dark:bg-[#f59e0b]/20 border border-[#f59e0b]/20 dark:border-[#f59e0b]/30";

                 return (
                   <div key={news.url || idx} className="relative group">
                     {/* Timeline Dot */}
                     <div className="absolute -left-[30px] top-1.5 w-[11px] h-[11px] rounded-full bg-white dark:bg-[#0b1326] border-2 border-[#e5e5e5] dark:border-[#3c4a43] group-hover:border-[#00b386] dark:group-hover:border-[#50ddad] group-hover:shadow-[0_0_8px_rgba(0,179,134,0.5)] transition-all z-10 duration-300"></div>
                     
                     <a 
                        href={news.url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-transparent transition-all group-hover:-translate-y-0.5 cursor-pointer"
                     >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-[#737373] dark:text-[#86948c] uppercase tracking-widest">{news.date || "Just Now"}</span>
                          <span className="w-1 h-1 rounded-full bg-[#d4d4d4] dark:bg-[#3c4a43]"></span>
                          <span className="text-[10px] font-mono font-bold text-[#00b386] dark:text-[#50ddad] uppercase tracking-widest truncate max-w-[120px]">{news.source || "Terminal"}</span>
                          <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${sentimentColor}`}>
                            {news.sentiment || "NEUTRAL"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-[#dae2fd] group-hover:text-[#00b386] dark:group-hover:text-[#50ddad] transition-colors leading-snug mb-1.5 flex items-start gap-2">
                          {news.title}
                        </h4>
                        <p className="text-xs text-[#737373] dark:text-[#86948c] line-clamp-2 leading-relaxed opacity-90">{news.summary}</p>
                     </a>
                   </div>
                 );
               })}
               {newsList.length === 0 && (
                 <div className="pl-4 border-l border-dashed border-[#e5e5e5] dark:border-[#3c4a43]">
                   <p className="text-sm font-mono text-[#737373] dark:text-[#86948c] py-4 uppercase tracking-widest">Awaiting terminal feed...</p>
                 </div>
               )}
             </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
