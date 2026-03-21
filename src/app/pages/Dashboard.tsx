import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Plus,
  Eye,
  Clock,
  AlertTriangle,
  TrendingDown,
  Filter,
  ArrowUpDown,
  Upload,
  FileBarChart,
  Bell,
  Zap,
  Activity,
} from "lucide-react";
import Layout from "../components/Layout";
import AIChatbot from "../components/AIChatbot";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultRiskDist = [
  { name: "Low Risk", value: 0, color: "#10b981" },
  { name: "Medium Risk", value: 0, color: "#f59e0b" },
  { name: "High Risk", value: 0, color: "#ef4444" },
];

const trendData = [
  { month: "Oct", applications: 42, highRisk: 8 },
  { month: "Nov", applications: 51, highRisk: 12 },
  { month: "Dec", applications: 47, highRisk: 9 },
  { month: "Jan", applications: 58, highRisk: 11 },
  { month: "Feb", applications: 64, highRisk: 14 },
  { month: "Mar", applications: 71, highRisk: 15 },
];

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "3 High-Risk Cases Detected",
    description: "Urban Construction Ltd and 2 others flagged for manual review",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Revenue Mismatch Alert",
    description: "2 companies showing GST-Bank discrepancy >15%",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "info",
    title: "AI Recommends Manual Review",
    description: "Global Exports & Trading Co requires additional scrutiny",
    time: "1 day ago",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [filterRisk, setFilterRisk] = useState("all");
  const [appData, setAppData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, approved: 0, approvalRate: 0 });
  const [riskDistribution, setRiskDistribution] = useState(defaultRiskDist);

  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppData(data);
      })
      .catch(err => console.error("Failed to fetch applications:", err));

    fetch("http://localhost:8000/api/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setStats({ total: data.total || 0, highRisk: data.highRisk || 0, approved: data.approved || 0, approvalRate: data.approvalRate || 0 });
        if (data.riskDist) setRiskDistribution(data.riskDist);
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-[#10b981] bg-[#d1fae5] dark:bg-[#065f46] dark:text-[#86efac]";
      case "medium":
        return "text-[#f59e0b] bg-[#fef3c7] dark:bg-[#78350f] dark:text-[#fcd34d]";
      case "high":
        return "text-[#ef4444] bg-[#fee2e2] dark:bg-[#7f1d1d] dark:text-[#fca5a5]";
      default:
        return "text-[#737373] bg-[#f5f5f5] dark:bg-[#334155] dark:text-[#94a3b8]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[#d1fae5] text-[#10b981] dark:bg-[#065f46] dark:text-[#86efac]";
      case "Flagged":
        return "bg-[#fee2e2] text-[#ef4444] dark:bg-[#7f1d1d] dark:text-[#fca5a5]";
      case "Under Review":
        return "bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f] dark:text-[#fcd34d]";
      case "Processing":
        return "bg-[#e0e7ff] text-[#6366f1] dark:bg-[#312e81] dark:text-[#a5b4fc]";
      default:
        return "bg-[#f5f5f5] text-[#737373] dark:bg-[#334155] dark:text-[#94a3b8]";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-[#ef4444] bg-[#fee2e2] dark:bg-[#7f1d1d]/20";
      case "warning":
        return "border-l-[#f59e0b] bg-[#fef3c7] dark:bg-[#78350f]/20";
      case "info":
        return "border-l-[#3b82f6] bg-[#dbeafe] dark:bg-[#1e3a8a]/20";
      default:
        return "border-l-[#737373] bg-[#f5f5f5] dark:bg-[#334155]";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <AIChatbot />

        {/* AI Insights - Priority Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-[#ef4444] to-[#dc2626] dark:from-[#7f1d1d] dark:to-[#991b1b] rounded-[24px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl">Critical Alert</h3>
                    <p className="text-sm opacity-90">Requires immediate attention</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <h2 className="text-4xl">{stats.highRisk} High-Risk Cases</h2>
                  <p className="text-base opacity-90">
                    Revenue mismatch detected in 2 companies • AI recommends manual review
                  </p>
                </div>
                <button
                  onClick={() => navigate("/history")}
                  className="mt-6 px-6 py-3 bg-white text-[#ef4444] rounded-xl hover:shadow-lg transition-all"
                >
                  Review Cases →
                </button>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-75">Last updated</p>
                <p className="text-base">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Total Applications</p>
                <p className="text-3xl text-[#1a1a1a] dark:text-white">{stats.total}</p>
                <p className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#0f766e] dark:to-[#065f46] rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#00b386]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">High Risk Cases</p>
                <p className="text-3xl text-[#1a1a1a] dark:text-white">{stats.highRisk}</p>
                <p className="text-xs text-[#ef4444] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#7f1d1d] dark:to-[#991b1b] rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#ef4444]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Approved Loans</p>
                <p className="text-3xl text-[#1a1a1a] dark:text-white">{stats.approved}</p>
                <p className="text-xs text-[#10b981] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {stats.approvalRate}% approval rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] dark:from-[#065f46] dark:to-[#047857] rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#10b981]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Avg Processing</p>
                <p className="text-3xl text-[#1a1a1a] dark:text-white">2.4h</p>
                <p className="text-xs text-[#10b981] flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  15% faster
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a] dark:to-[#1e40af] rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#3b82f6]" />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Overview and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155]">
            <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8]">{item.name}</p>
                  <p className="text-sm text-[#1a1a1a] dark:text-white">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Real-Time Alerts</h3>
              <Bell className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-l-4 ${getAlertColor(alert.type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm text-[#1a1a1a] dark:text-white mb-1">{alert.title}</h4>
                      <p className="text-xs text-[#737373] dark:text-[#94a3b8]">{alert.description}</p>
                    </div>
                    <span className="text-xs text-[#737373] dark:text-[#94a3b8] whitespace-nowrap ml-4">
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend Visualization */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[20px] p-6 shadow-lg border border-[#e5e5e5] dark:border-[#334155]">
          <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-6">Application & Risk Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
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
              <Line type="monotone" dataKey="applications" stroke="#00b386" strokeWidth={3} name="Total Applications" />
              <Line type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={3} name="High Risk Cases" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/new-application")}
            className="p-6 bg-gradient-to-br from-[#00b386] to-[#059669] dark:from-[#0f766e] dark:to-[#065f46] text-white rounded-[20px] shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h4 className="text-lg">Analyze New Company</h4>
                <p className="text-sm opacity-90">Start credit assessment</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/new-application")}
            className="p-6 bg-white dark:bg-[#1e293b] text-[#1a1a1a] dark:text-white rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#0f766e] dark:to-[#065f46] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-[#00b386]" />
              </div>
              <div className="text-left">
                <h4 className="text-lg">Upload Data</h4>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Bulk file import</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/history")}
            className="p-6 bg-white dark:bg-[#1e293b] text-[#1a1a1a] dark:text-white rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a] dark:to-[#1e40af] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileBarChart className="w-7 h-7 text-[#3b82f6]" />
              </div>
              <div className="text-left">
                <h4 className="text-lg">Generate Report</h4>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Export analytics</p>
              </div>
            </div>
          </button>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155]">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-[#334155] flex items-center justify-between">
            <div>
              <h2 className="text-xl text-[#1a1a1a] dark:text-white">Recent Applications</h2>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">Track and manage loan applications</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#e5e5e5] dark:border-[#334155] rounded-xl hover:bg-[#f5f5f5] dark:hover:bg-[#334155] transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#737373] dark:text-[#94a3b8]" />
                <span className="text-sm text-[#737373] dark:text-[#94a3b8]">Filter</span>
              </button>
              <button className="px-4 py-2 border border-[#e5e5e5] dark:border-[#334155] rounded-xl hover:bg-[#f5f5f5] dark:hover:bg-[#334155] transition-colors flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#737373] dark:text-[#94a3b8]" />
                <span className="text-sm text-[#737373] dark:text-[#94a3b8]">Sort</span>
              </button>
              <button
                onClick={() => navigate("/new-application")}
                className="px-6 py-2 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Application
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e5] dark:border-[#334155]">
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Flag
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#334155]">
                {appData.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafafa] dark:hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#1a1a1a] dark:text-white">{app.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#1a1a1a] dark:text-white">{app.company}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#1a1a1a] dark:text-white">{app.loanAmount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#1a1a1a] dark:text-white">{app.riskScore}</span>
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(app.riskLevel)}`}>
                          {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-[#e5e5e5] dark:bg-[#334155] rounded-full h-2">
                          <div
                            className="bg-[#00b386] h-2 rounded-full"
                            style={{ width: `${app.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-[#737373] dark:text-[#94a3b8]">{app.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.flag ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                          <span className="text-xs text-[#737373] dark:text-[#94a3b8]">{app.flag}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#737373] dark:text-[#94a3b8]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/credit-analysis/${app.id}`)}
                        className="px-4 py-2 text-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e] rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
