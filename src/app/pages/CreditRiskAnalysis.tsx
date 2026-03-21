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

const gstVsBankData = [
  { month: "Jan", gst: 850000, bank: 820000 },
  { month: "Feb", gst: 920000, bank: 880000 },
  { month: "Mar", gst: 780000, bank: 850000 },
  { month: "Apr", gst: 950000, bank: 920000 },
  { month: "May", gst: 1100000, bank: 980000 },
  { month: "Jun", gst: 1050000, bank: 1020000 },
];

const cashFlowData = [
  { quarter: "Q1", inflow: 2800000, outflow: 2400000 },
  { quarter: "Q2", inflow: 3200000, outflow: 2600000 },
  { quarter: "Q3", inflow: 3100000, outflow: 2800000 },
  { quarter: "Q4", inflow: 3500000, outflow: 2900000 },
];

const riskBreakdown = [
  { name: "Financial Risk", value: 35, color: "#f59e0b" },
  { name: "Fraud Indicators", value: 25, color: "#ef4444" },
  { name: "External Factors", value: 15, color: "#3b82f6" },
  { name: "Normal", value: 25, color: "#10b981" },
];

const industryInsights = [
  { category: "Profitability", company: 75, industry: 82 },
  { category: "Liquidity", company: 68, industry: 75 },
  { category: "Efficiency", company: 71, industry: 70 },
  { category: "Leverage", company: 45, industry: 65 },
  { category: "Growth", company: 82, industry: 75 },
];

const newsData = [
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

const peerComparison = [
  { metric: "Profit Margin (%)", company: 12.5, industry: 15.2 },
  { metric: "Debt Ratio", company: 0.68, industry: 0.52 },
  { metric: "Liquidity Ratio", company: 1.8, industry: 2.1 },
  { metric: "Revenue Growth (%)", company: 18, industry: 22 },
];

export default function CreditRiskAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();

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
                <h2 className="text-5xl text-[#1a1a1a] dark:text-white">56</h2>
                <span className="text-2xl text-[#f59e0b] mb-1">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-4 py-1 bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f] dark:text-[#fcd34d] rounded-full text-sm">
                  Medium Risk
                </span>
                <TrendingDown className="w-5 h-5 text-[#ef4444]" />
                <span className="text-sm text-[#ef4444]">Declining trend</span>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Company</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">TechVista Solutions Pvt Ltd</p>
              </div>
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Loan Amount</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">₹50,00,000</p>
              </div>
              <div>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Analysis Date</p>
                <p className="text-sm text-[#1a1a1a] dark:text-white">March 19, 2026</p>
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
                The medium risk classification is driven by a <strong>15% GST-Bank revenue mismatch</strong> and a{" "}
                <strong>debt ratio of 0.68</strong> (vs industry avg 0.52). However, the company demonstrates{" "}
                <strong>consistent 18% YoY growth</strong> and acceptable liquidity ratios. <strong>Recommendation:</strong>{" "}
                Approve ₹35L (70% of requested amount) with enhanced monitoring and quarterly reviews.
              </p>
              <div className="flex gap-3 pt-2">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Confidence</p>
                  <p className="text-lg">78%</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Risk Factors</p>
                  <p className="text-lg">3 Major</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-xs opacity-75">Manual Review</p>
                  <p className="text-lg">Required</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-4">
          <h3 className="text-lg text-[#1a1a1a] dark:text-white">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 p-4 bg-[#fef3c7] dark:bg-[#78350f]/20 rounded-xl border border-[#f59e0b]/20">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1a1a1a] dark:text-white">Revenue Mismatch Detected</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                  15% discrepancy between GST and bank credits
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#fee2e2] dark:bg-[#7f1d1d]/20 rounded-xl border border-[#ef4444]/20">
              <AlertTriangle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1a1a1a] dark:text-white">Cash Flow Irregularities</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                  Unusual transaction patterns in Q3
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#d1fae5] dark:bg-[#065f46]/20 rounded-xl border border-[#10b981]/20">
              <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1a1a1a] dark:text-white">Consistent Growth Pattern</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">18% YoY revenue growth maintained</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#fef3c7] dark:bg-[#78350f]/20 rounded-xl border border-[#f59e0b]/20">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1a1a1a] dark:text-white">High Debt Ratio</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">0.68 vs industry average of 0.52</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GST vs Bank Revenue */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-6">
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">GST vs Bank Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gstVsBankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-[#334155]" />
                <XAxis dataKey="month" stroke="#737373" className="dark:stroke-[#94a3b8]" />
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
            <h3 className="text-lg text-[#1a1a1a] dark:text-white">Industry Performance Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={industryInsights}>
              <PolarGrid stroke="#e5e5e5" className="dark:stroke-[#334155]" />
              <PolarAngleAxis dataKey="category" stroke="#737373" className="dark:stroke-[#94a3b8]" />
              <PolarRadiusAxis stroke="#737373" className="dark:stroke-[#94a3b8]" />
              <Radar name="Company" dataKey="company" stroke="#00b386" fill="#00b386" fillOpacity={0.6} />
              <Radar name="Industry Avg" dataKey="industry" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
            </RadarChart>
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
              {newsData.map((news) => (
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
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8] leading-relaxed">{news.summary}</p>
                  <button className="mt-2 text-xs text-[#00b386] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ExternalLink className="w-3 h-3" />
                  </button>
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
                  data={riskBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3">
              {riskBreakdown.map((item) => (
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
              <p className="text-3xl">₹35,00,000</p>
              <p className="text-xs opacity-75">70% of requested amount</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Risk Level</p>
              <p className="text-3xl">Medium</p>
              <p className="text-xs opacity-75">Enhanced monitoring required</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Confidence Score</p>
              <p className="text-3xl">78%</p>
              <p className="text-xs opacity-75">High confidence in assessment</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
