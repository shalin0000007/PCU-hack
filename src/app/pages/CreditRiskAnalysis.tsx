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
  AlertCircle
} from "lucide-react";
import Layout from "../components/Layout";
import AIChatbot from "../components/AIChatbot";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

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

const newsDataFallback = [
  {
    id: 1,
    title: "Company Secures Major IT Contract",
    source: "Economic Times",
    sentiment: "positive",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Industry Growth Slows in Q4",
    source: "Business Standard",
    sentiment: "neutral",
    date: "1 week ago",
  },
  {
    id: 3,
    title: "Regulatory Compliance Concerns",
    source: "Financial Express",
    sentiment: "negative",
    date: "2 weeks ago",
  },
];

export default function CreditRiskAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportData, setReportData] = useState<any>(null);
  const [aiAssessment, setAiAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        // Realistic fallback data for visual constraints testing
        setReportData({
          application: {
            loan_amount: 5000000,
            companies: { name: "TechVista Solutions Pvt Ltd", md_id: "U72900KA2019PTC123456" }
          },
          report: {
            created_at: new Date().toISOString(),
            risk_score: 68,
            risk_level: "medium",
            ai_summary: "The company shows moderate risk due to inconsistent revenue reporting and dependency on cyclical industry demand. A 15% revenue mismatch was detected in consecutive quarters. Liquidity ratios remain adequate.",
            confidence_score: 72,
            manual_review_required: true,
            recommended_amount: 3500000,
            key_findings: [
              { title: "Revenue Mismatch Detected", description: "15% discrepancy between GST filings and bank credits over a 6-month period." },
              { title: "High Vendor Concentration", description: "Dependencies on top 2 clients constitute 65% of total inflow." },
              { title: "Consistent Growth Pattern", description: "18% YoY revenue growth maintained with moderate margin compression." }
            ],
            chart_data: {
              gst_vs_bank: gstVsBankDataFallback,
              cash_flow: cashFlowDataFallback,
            },
            news_data: newsDataFallback
          }
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <p className="text-slate-500 font-mono text-sm mt-10">Fetching risk evaluation profile [{id}]...</p>
        </div>
      </Layout>
    );
  }

  if (!reportData || !reportData.report) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 rounded-md flex items-start gap-3 w-full max-w-2xl">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 dark:text-red-400 font-medium">Record Not Found</h3>
              <p className="text-red-600 dark:text-red-500 text-sm mt-1">Unable to locate records for Application ID {id}. The file may be pending final generation or archived.</p>
              <div className="mt-4">
                <button onClick={() => navigate("/dashboard")} className="px-4 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm border border-slate-300 dark:border-slate-700 rounded shadow-sm">
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { application, report } = reportData;
  const companyName = application?.companies?.name || "Unknown Company";
  const cinId = application?.companies?.md_id || "System Verified";

  const riskScore = aiAssessment?.score ?? report?.risk_score ?? 68;
  const riskLevel = aiAssessment?.risk_level ?? report?.risk_level ?? "medium";
  const confidenceLevel = aiAssessment?.confidence ?? report?.confidence_score ?? 72;
  const aiExplanation = aiAssessment?.summary ?? report?.ai_summary ?? "The company shows moderate risk due to tracking disparities.";
  const keyFindings = aiAssessment?.key_findings?.length ? aiAssessment?.key_findings : report?.key_findings ?? [];
  const recommendedAmount = report?.recommended_amount || 3500000;

  const newsList = liveNews || report.news_data || [];

  const rawGstBankData = report.chart_data?.gst_vs_bank || [];
  const mappedGstBankData = rawGstBankData.map((d: any) => ({
    month: String(d.month || d.originalMonth || "Unknown").split(" ")[0],
    gst: d.gstRevenue || d.gst || 0,
    bank: d.bankCredits || d.bank || 0,
  }));

  const totalGst = mappedGstBankData.reduce((acc: number, val: any) => acc + val.gst, 0);
  const totalBank = mappedGstBankData.reduce((acc: number, val: any) => acc + val.bank, 0);
  const difference = Math.abs(totalGst - totalBank);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const cashFlowData = report.chart_data?.cash_flow || [];

  return (
    <Layout>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] pb-12">
        <AIChatbot />

        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">Analysis Profile</h1>
                <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono rounded border border-slate-200 dark:border-slate-700">{id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/report/${id}`)}
              className="px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              Preview Internal Report
            </button>
            <button className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Risk Block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 left-0 bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Company Profile</p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{companyName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{cinId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Loan Sought</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">₹{application?.loan_amount?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">System Risk Index</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-mono font-bold text-slate-900 dark:text-white">{riskScore}</span>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border inline-block w-max ${riskLevel === 'high' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'}`}>
                        {riskLevel} RISK
                      </span>
                      {riskScore < 50 ? (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><TrendingDown className="w-3 h-3" /> Declining stability</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><TrendingUp className="w-3 h-3" /> Sustained stability</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyst Note / AI Explanation */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Analyst Note (Auto-Generated)</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic border-l-4 border-l-slate-400">
                "{aiExplanation}"
              </div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-3">System Anomalies & Key Findings</h3>
              <div className="space-y-3">
                {keyFindings.map((finding: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                    <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{finding.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{finding.description}</p>
                    </div>
                  </div>
                ))}
                {keyFindings.length === 0 && (
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No anomalies detected</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Parameters are within established safe limits.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Financial Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Financial Summary Sheet</h3>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800">
                <div className="text-center px-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Declared GST</p>
                  <p className="text-lg font-mono text-slate-800 dark:text-slate-200">{formatCurrency(totalGst)}</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Bank Credited</p>
                  <p className="text-lg font-mono text-slate-800 dark:text-slate-200">{formatCurrency(totalBank)}</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mismatch (Abs)</p>
                  <p className={`text-lg font-mono ${difference > 50000 ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>{formatCurrency(difference)}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="px-4 py-2 font-medium">Period</th>
                    <th className="px-4 py-2 font-medium">GST Record</th>
                    <th className="px-4 py-2 font-medium">Bank Record</th>
                    <th className="px-4 py-2 font-medium">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {mappedGstBankData.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400 font-sans font-medium">{row.month}</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">₹{(row.gst / 1000).toFixed(1)}k</td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">₹{(row.bank / 1000).toFixed(1)}k</td>
                      <td className={`px-4 py-2 ${Math.abs(row.gst - row.bank) > 10000 ? 'text-red-500' : 'text-slate-500'}`}>
                        {row.gst !== row.bank ? '⚠ ' : ''}{Math.abs(row.gst - row.bank).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
                <button className="text-[10px] uppercase font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">View Full Log</button>
              </div>
            </div>

            {/* Strict Graphs Area */}
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">GST vs Bank Trend (Line)</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mappedGstBankData}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(v) => `${v / 100000}L`} tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: "12px", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} iconSize={8} />
                      <Line type="linear" dataKey="gst" stroke="#334155" strokeWidth={2} dot={{ r: 2 }} name="GST Filed" />
                      <Line type="linear" dataKey="bank" stroke="#94a3b8" strokeWidth={2} dot={{ r: 2 }} name="Bank Inflow" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* News & External Market Intel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col flex-1 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">External Intelligence</h3>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">Automated Scan</span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {newsList.map((n: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <a href={n.url || "#"} className="text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 leading-snug">{n.title}</a>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase border ${n.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' : n.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {n.sentiment}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{n.source} • {n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final Output Panel */}
          <div className="bg-slate-900 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="flex gap-8 items-center">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Final Auth. Module</p>
                <p className="text-white font-medium">Clearance Confidence: {confidenceLevel}%</p>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-700"></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">System Action</p>
                <p className="text-white font-medium">Safe Limit: {formatCurrency(recommendedAmount)}</p>
              </div>
            </div>
            <div>
              <button className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-900 text-sm font-bold uppercase tracking-wider rounded border border-white transition-colors duration-200">
                Submit for Director Review
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
