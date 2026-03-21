import { useNavigate } from "react-router";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Sliders,
  Users,
  Star,
  Sparkles,
  Radio,
  User,
  Calendar,
} from "lucide-react";
import Layout from "../components/Layout";
import AIChatbot from "../components/AIChatbot";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "#006d4a" },
  { name: "Medium Risk", value: 25, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#9f403d" },
];

const trendData = [
  { day: "MON", volume: 180, risk: 20 },
  { day: "TUE", volume: 220, risk: 35 },
  { day: "WED", volume: 200, risk: 28 },
  { day: "THU", volume: 280, risk: 45 },
  { day: "FRI", volume: 250, risk: 38 },
  { day: "SAT", volume: 190, risk: 22 },
  { day: "SUN", volume: 210, risk: 30 },
];

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "ID Collision Detected",
    description: "Application #APP-0421 exhibits multiple ID associations in high-risk zones.",
    badge: "CRITICAL",
    badgeColor: "bg-error",
    action: "Review Dossier",
    time: "2m ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Income Discrepancy",
    description: "Cross-check with tax records shows a 15% delta in reported annual earnings.",
    badge: "MANUAL CHECK",
    badgeColor: "bg-amber-500",
    time: "16m ago",
  },
  {
    id: 3,
    type: "success",
    title: "Asset Validation Success",
    description: "Collateral evaluation for #APP-0912 confirmed by third-party auditor.",
    time: "1h ago",
  },
];

const priorityCases = [
  {
    id: 1,
    name: "Marcus Thorne",
    request: "$200,000",
    score: 450,
    risk: "High Risk",
    color: "border-l-error",
    bgColor: "bg-error-container",
  },
  {
    id: 2,
    name: "Nexus Logistics Ltd",
    request: "$1.2M",
    score: 380,
    risk: "High Risk",
    color: "border-l-error",
    bgColor: "bg-error-container",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    request: "$45,000",
    score: 470,
    risk: "High Risk",
    color: "border-l-error",
    bgColor: "bg-error-container",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-8">
        <AIChatbot />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-['Inter'] uppercase tracking-wider">
              <span>Portfolio</span>
              <span>/</span>
              <span>Dashboard Overview</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight font-['Manrope']">Portfolio Health</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-foreground hover:bg-surface-container transition-colors font-['Inter']">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </button>
            <button
              onClick={() => navigate("/new-application")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 transition-all font-['Inter'] font-medium"
            >
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Total Applications */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)] hover:shadow-[0_16px_40px_rgba(42,52,57,0.1)] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">Total Applications</p>
                <p className="text-3xl font-bold text-foreground font-['Manrope'] tracking-tight">1,284</p>
              </div>
              <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-semibold rounded-full">
                +8.4%
              </span>
            </div>
          </div>

          {/* High Risk Cases */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)] hover:shadow-[0_16px_40px_rgba(42,52,57,0.1)] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 bg-error-container rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">High Risk Cases</p>
                <p className="text-3xl font-bold text-foreground font-['Manrope'] tracking-tight">24</p>
              </div>
              <span className="px-2.5 py-1 bg-error-container text-on-error-container text-xs font-semibold rounded-full">
                +3 New
              </span>
            </div>
          </div>

          {/* Approved Loans */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)] hover:shadow-[0_16px_40px_rgba(42,52,57,0.1)] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 bg-tertiary-container rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-tertiary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">Approved Loans</p>
                <p className="text-3xl font-bold text-foreground font-['Manrope'] tracking-tight">892</p>
              </div>
              <span className="px-2.5 py-1 bg-surface-container text-muted-foreground text-xs font-semibold rounded-full">
                69% Rate
              </span>
            </div>
          </div>

          {/* Avg Processing */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)] hover:shadow-[0_16px_40px_rgba(42,52,57,0.1)] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">Avg Processing</p>
                <p className="text-3xl font-bold text-foreground font-['Manrope'] tracking-tight">
                  4.2<span className="text-lg font-normal text-muted-foreground ml-1">Days</span>
                </p>
              </div>
              <div className="w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle cx="18" cy="18" r="15" fill="none" className="stroke-surface-container" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-tertiary"
                    strokeWidth="3"
                    strokeDasharray="70 30"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Application & Risk Trends - Takes 2 columns */}
          <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground font-['Manrope']">Application & Risk Trends</h3>
                <p className="text-sm text-muted-foreground mt-0.5 font-['Inter']">Volume vs Risk distribution over time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-tertiary rounded-full"></span>
                  <span className="text-sm text-muted-foreground font-['Inter']">Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-error rounded-full"></span>
                  <span className="text-sm text-muted-foreground font-['Inter']">Risk</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006d4a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006d4a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9f403d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9f403d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#70777e", fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#70777e", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8eaed",
                    borderRadius: "12px",
                    boxShadow: "0 12px 32px rgba(42,52,57,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#006d4a"
                  strokeWidth={2}
                  fill="url(#volumeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#9f403d"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <h3 className="text-lg font-bold text-foreground mb-6 font-['Manrope']">Risk Distribution</h3>
            <div className="flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground uppercase font-['Inter']">Overall</span>
                  <span className="text-2xl font-bold text-foreground font-['Manrope']">Med</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground font-['Inter']">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground font-['Inter']">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Risk Alerts & Analyst Insights */}
        <div className="grid grid-cols-3 gap-6">
          {/* Live Risk Alerts - Takes 2 columns */}
          <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground font-['Manrope']">Live Risk Alerts</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-error-container rounded-full">
                <Radio className="w-3.5 h-3.5 text-error animate-pulse" />
                <span className="text-xs font-semibold text-on-error-container uppercase tracking-wide font-['Inter']">Live Monitoring</span>
              </div>
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === "critical"
                        ? "bg-error-container"
                        : alert.type === "warning"
                        ? "bg-amber-100"
                        : "bg-tertiary-container"
                    }`}
                  >
                    {alert.type === "critical" ? (
                      <AlertTriangle className="w-4 h-4 text-error" />
                    ) : alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-tertiary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground font-['Manrope']">{alert.title}</h4>
                      {alert.badge && (
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold text-white rounded ${alert.badgeColor}`}
                        >
                          {alert.badge}
                        </span>
                      )}
                      {alert.action && (
                        <button className="text-xs text-tertiary hover:text-tertiary/80 font-semibold font-['Inter']">
                          {alert.action}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 font-['Inter']">{alert.description}</p>
                  </div>
                  <span className="text-xs text-outline-variant whitespace-nowrap font-['Inter']">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Insights */}
          <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2 font-['Manrope']">Analyst Insights</h3>
            <p className="text-sm text-primary-foreground/80 mb-6 font-['Inter']">
              "Based on current trends, we recommend tightening credit limits for the SME segment due
              to increasing regional volatility."
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors font-['Inter']">
              Generate Full Report
            </button>

            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-4 font-['Manrope']">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Download className="w-5 h-5" />
                  <span className="text-xs font-['Inter']">Export Data</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Sliders className="w-5 h-5" />
                  <span className="text-xs font-['Inter']">Adjust Rules</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-['Inter']">Add User</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Star className="w-5 h-5" />
                  <span className="text-xs font-['Inter']">API Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Cases */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground font-['Manrope']">Priority Cases</h3>
              <p className="text-sm text-muted-foreground mt-0.5 font-['Inter']">Immediate action required on these entities</p>
            </div>
            <button className="text-sm text-tertiary hover:text-tertiary/80 font-semibold font-['Inter']">
              View All High Risk →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {priorityCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className={`${caseItem.bgColor} border-l-4 ${caseItem.color} rounded-xl p-5`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-surface-container-lowest rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="px-2.5 py-1 bg-error text-white text-xs font-semibold rounded-full">
                    {caseItem.risk}
                  </span>
                </div>
                <h4 className="font-bold text-foreground mb-1 font-['Manrope']">{caseItem.name}</h4>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">
                  Request: <span className="text-foreground font-medium">{caseItem.request}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4 font-['Inter']">
                  Score: <span className="text-foreground font-medium">{caseItem.score}</span>
                </p>
                <button
                  onClick={() => navigate("/credit-analysis/1")}
                  className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-all font-['Inter']"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
