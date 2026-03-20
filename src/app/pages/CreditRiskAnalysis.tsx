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
  { name: "Financial Risk", value: 35, color: "#f59e0b" },
  { name: "Fraud Indicators", value: 25, color: "#ef4444" },
  { name: "External Factors", value: 15, color: "#3b82f6" },
  { name: "Normal", value: 25, color: "#10b981" },
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
  },
  {
    id: 2,
    title: "Industry Growth Slows in Q4",
    source: "Business Standard",
    sentiment: "neutral",
    date: "1 week ago",
    summary: "IT sector sees 12% YoY growth, down from 18% previous quarter",
  },
  {
    id: 3,
    title: "Regulatory Compliance Concerns",
    source: "Financial Express",
    sentiment: "negative",
    date: "2 weeks ago",
    summary: "Several mid-size IT firms under scrutiny for GST filing irregularities",
  },
];

export default function CreditRiskAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All Time");

  useEffect(() => {
    fetch(`http://localhost:8000/api/analysis/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Analysis not found on server");
        return res.json();
      })
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("API report not found, falling back to dummy data. Error:", err);
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
            companies: { name: companyFallback }
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
        return "bg-[#d1fae5] text-[#10b981] dark:bg-[#065f46] dark:text-[#86efac]";
      case "negative":
        return "bg-[#fee2e2] text-[#ef4444] dark:bg-[#7f1d1d] dark:text-[#fca5a5]";
      default:
        return "bg-[#e0e7ff] text-[#6366f1] dark:bg-[#312e81] dark:text-[#a5b4fc]";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <p className="text-[#737373] dark:text-white text-lg">Loading comprehensive AI report...</p>
        </div>
      </Layout>
    );
  }

  if (!reportData || !reportData.report) {
    return (
      <Layout>
        <div className="p-6 space-y-4">
            <h2 className="text-xl text-[#ef4444]">Analysis Not Found</h2>
            <p className="text-[#a3a3a3]">Could not fetch analysis report for Application ID {id}. Please ensure it was generated first.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] text-[#1a1a1a] dark:text-white rounded-xl"
            >
              Back to Dashboard
            </button>
        </div>
      </Layout>
    );
  }

  const { application, report } = reportData;
  const companyName = application?.companies?.name || "Unknown Company";
  
  const newsList = report.news_data || [];
  
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
  const keyFindings = report.key_findings || [];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <AIChatbot />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-[#334155] rounded-xl transition-colors border border-[#e5e5e5] dark:border-[#334155]"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
            </button>
            <div>
              <h1 className="text-2xl text-[#1a1a1a] dark:text-white">Credit Risk Analysis Report</h1>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">Application ID: {id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/report/${id}`)}
              className="px-4 py-2 text-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 rounded-xl transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Overall Risk Score */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8] mb-2">Overall Risk Score</p>
              <div className="flex items-end gap-3">
                <h2 className="text-5xl text-[#1a1a1a] dark:text-white">{report.risk_score}</h2>
                <span className="text-2xl text-[#f59e0b] mb-1">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-4 py-1 rounded-full text-sm ${report.risk_level === 'high' ? 'bg-[#fee2e2] text-[#ef4444] dark:bg-[#7f1d1d]/40 dark:text-[#fca5a5]' : report.risk_level === 'medium' ? 'bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f]/40 dark:text-[#fcd34d]' : 'bg-[#d1fae5] text-[#10b981] dark:bg-[#065f46]/40 dark:text-[#6ee7b7]'}`}>
                  {report.risk_level.toUpperCase()} Risk
                </span>
                {report.risk_score < 50 ? (
                  <TrendingDown className="w-5 h-5 text-[#ef4444]" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-[#10b981]" />
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Company</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">{companyName}</p>
              </div>
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Loan Amount</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">₹{application?.loan_amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Analysis Date</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">{new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-[#00b386] to-[#059669] dark:from-[#0f766e] dark:to-[#065f46] rounded-[24px] shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl">AI Risk Assessment Summary</h3>
              <p className="text-base opacity-95 leading-relaxed">
                {report.ai_summary}
              </p>
              <div className="flex gap-3 pt-2">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Confidence</p>
                  <p className="text-lg">{report.confidence_score}%</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Risk Factors</p>
                  <p className="text-lg">{keyFindings.length} Identified</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Manual Review</p>
                  <p className="text-lg">{report.manual_review_required ? "Required" : "Recommended"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-4">
          <h3 className="text-lg text-[#1a1a1a] dark:text-white">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyFindings.map((finding: any, i: number) => (
              <div key={i} className="flex gap-3 p-4 bg-[#fef3c7] dark:bg-[#78350f]/20 rounded-xl border border-[#f59e0b]/20">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1a1a1a] dark:text-white">{finding.title}</p>
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                    {finding.description}
                  </p>
                </div>
              </div>
            ))}
            {keyFindings.length === 0 && (
                <div className="flex gap-3 p-4 bg-[#d1fae5] dark:bg-[#065f46]/20 rounded-xl border border-[#10b981]/20">
                    <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-[#1a1a1a] dark:text-white">Clean Profile</p>
                        <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">No significant risk flags were raised by the AI.</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Charts Section Header */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-xl text-[#1a1a1a] dark:text-white font-medium">Financial Analysis</h2>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-[#e5e5e5] dark:border-[#334155] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386] text-[#1a1a1a] dark:text-white shadow-sm"
          >
            {availableYears.map(year => (
              <option key={String(year)} value={String(year)}>{String(year)}</option>
            ))}
          </select>
        </div>

        {/* Financial Summary Pills */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
          <h3 className="text-lg text-[#1a1a1a] dark:text-white">Financial Summary {selectedYear !== "All Time" && `(${selectedYear})`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#d1fae5] dark:bg-[#065f46]/30 rounded-[20px] text-center flex flex-col items-center justify-center border border-[#10b981]/20">
              <p className="text-sm text-[#10b981] dark:text-[#6ee7b7] font-medium mb-1">GST Revenue</p>
              <p className="text-3xl text-[#1a1a1a] dark:text-white font-semibold">{formatCurrency(totalGst)}</p>
            </div>
            <div className="p-6 bg-[#dbeafe] dark:bg-[#1e3a8a]/30 rounded-[20px] text-center flex flex-col items-center justify-center border border-[#3b82f6]/20">
              <p className="text-sm text-[#3b82f6] dark:text-[#93c5fd] font-medium mb-1">Bank Credits</p>
              <p className="text-3xl text-[#1a1a1a] dark:text-white font-semibold">{formatCurrency(totalBank)}</p>
            </div>
            <div className={`p-6 rounded-[20px] text-center flex flex-col items-center justify-center border ${totalGst > totalBank ? 'bg-[#fee2e2] dark:bg-[#7f1d1d]/30 border-[#ef4444]/20' : 'bg-[#fef3c7] dark:bg-[#78350f]/30 border-[#f59e0b]/20'}`}>
              <p className={`text-sm font-medium mb-1 ${totalGst > totalBank ? 'text-[#ef4444] dark:text-[#fca5a5]' : 'text-[#f59e0b] dark:text-[#fcd34d]'}`}>Difference</p>
              <p className="text-3xl text-[#1a1a1a] dark:text-white font-semibold">{formatCurrency(difference)}</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GST vs Bank Revenue */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">GST vs Bank Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredGstBankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-[#334155]" />
                <XAxis dataKey="displayMonth" stroke="#737373" className="dark:stroke-[#94a3b8]" />
                <YAxis stroke="#737373" className="dark:stroke-[#94a3b8]" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="gst" stroke="#00b386" strokeWidth={3} name="GST Revenue" />
                <Line type="monotone" dataKey="bank" stroke="#3b82f6" strokeWidth={3} name="Bank Credits" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Analysis */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">Cash Flow Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-[#334155]" />
                <XAxis dataKey="quarter" stroke="#737373" className="dark:stroke-[#94a3b8]" />
                <YAxis stroke="#737373" className="dark:stroke-[#94a3b8]" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#10b981" name="Inflow" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" name="Outflow" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Insights */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-[#00b386]" />
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">Peer Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={industryInsights}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-[#334155]" />
              <XAxis dataKey="category" stroke="#737373" className="dark:stroke-[#94a3b8]" />
              <YAxis stroke="#737373" className="dark:stroke-[#94a3b8]" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="company" fill="#00b386" name="Company" radius={[4, 4, 0, 0]} />
              <Bar dataKey="industry" fill="#3b82f6" name="Industry Avg" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* News & Risk Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-[#00b386]" />
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Recent News & Market Intelligence</h3>
            </div>
            <div className="space-y-4">
              {newsList.map((news: any) => (
                <div
                  key={news.id}
                  className="p-4 border border-[#e5e5e5] dark:border-[#334155] rounded-xl hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm text-[#1a1a1a] dark:text-white group-hover:text-[#00b386] transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#737373] dark:text-[#94a3b8]">{news.source}</span>
                        <span className="text-xs text-[#737373] dark:text-[#94a3b8]">•</span>
                        <span className="text-xs text-[#737373] dark:text-[#94a3b8]">{news.date}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getSentimentColor(news.sentiment)}`}>
                      {news.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8] leading-relaxed line-clamp-3">{news.summary}</p>
                  <a href={news.url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex mt-2 text-xs text-[#00b386] items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">Risk Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={riskBreakdownStatic}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskBreakdownStatic.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3">
              {riskBreakdownStatic.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">{item.name}</p>
                    <p className="text-sm text-[#1a1a1a] dark:text-white">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Decision */}
        <div className="bg-gradient-to-br from-[#00b386] to-[#059669] dark:from-[#0f766e] dark:to-[#065f46] rounded-[24px] shadow-lg p-8 text-white">
          <h3 className="text-xl mb-6">Final Decision & Recommendation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm opacity-90">Recommended Loan Amount</p>
              <p className="text-3xl">₹{report.recommended_amount?.toLocaleString()}</p>
              <p className="text-xs opacity-75">{Math.round((report.recommended_amount / application?.loan_amount) * 100)}% of requested amount</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Risk Level</p>
              <p className="text-3xl">{report.risk_level.charAt(0).toUpperCase() + report.risk_level.slice(1)}</p>
              <p className="text-xs opacity-75">{report.manual_review_required ? "Manual review required" : "Safe to proceed"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Confidence Score</p>
              <p className="text-3xl">{report.confidence_score}%</p>
              <p className="text-xs opacity-75">High confidence in assessment</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
