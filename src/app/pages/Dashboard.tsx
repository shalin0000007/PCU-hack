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
  { name: "Low Risk", value: 0, color: "#50ddad" },
  { name: "Medium Risk", value: 0, color: "#fbbf24" },
  { name: "High Risk", value: 0, color: "#ef4444" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [appData, setAppData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, approved: 0, approvalRate: 0 });
  const [riskDistribution, setRiskDistribution] = useState(defaultRiskDist);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'https://credintel-backend.onrender.com'}/api/applications`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppData(data);
      })
      .catch(err => console.error("Failed to fetch applications:", err));

    fetch(`${import.meta.env.VITE_API_URL || 'https://credintel-backend.onrender.com'}/api/dashboard-stats`)
      .then(res => res.json())
      .then(data => {
        setStats({ total: data.total || 0, highRisk: data.highRisk || 0, approved: data.approved || 0, approvalRate: data.approvalRate || 0 });
        if (data.riskDist && data.riskDist.length > 0) {
          // ensure updated colors
          const updatedRiskDist = data.riskDist.map((item: any) => {
            if (item.name === "Low Risk") return { ...item, color: "#50ddad" };
            if (item.name === "Medium Risk") return { ...item, color: "#fbbf24" };
            if (item.name === "High Risk") return { ...item, color: "#ef4444" };
            return item;
          });
          setRiskDistribution(updatedRiskDist);
        }
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  // Dynamic alerts from real data
  const alerts = (() => {
    const dynamicAlerts: any[] = [];
    const highRiskApps = appData.filter(a => a.riskLevel === "high");
    const flaggedApps = appData.filter(a => a.flag);
    const reviewApps = appData.filter(a => a.status === "Under Review");

    if (highRiskApps.length > 0) {
      dynamicAlerts.push({
        id: 1, type: "critical",
        title: `${highRiskApps.length} High-Risk Case${highRiskApps.length > 1 ? 's' : ''} Detected`,
        description: highRiskApps.map(a => a.company).slice(0, 2).join(" and ") + (highRiskApps.length > 2 ? ` and ${highRiskApps.length - 2} more` : '') + " flagged for manual review",
        time: "Live",
      });
    }
    if (flaggedApps.length > 0) {
      dynamicAlerts.push({
        id: 2, type: "warning",
        title: `${flaggedApps.length} Flagged Applications`,
        description: flaggedApps.map(a => a.flag).filter(Boolean).slice(0,2).join(", "),
        time: "14 mins ago",
      });
    }
    if (reviewApps.length > 0) {
      dynamicAlerts.push({
        id: 3, type: "info",
        title: `${reviewApps.length} Pending Reviews`,
        description: reviewApps.map(a => a.company).slice(0, 2).join(", ") + " require review",
        time: "1 hour ago",
      });
    }
    if (dynamicAlerts.length === 0) {
      dynamicAlerts.push({ id: 1, type: "info", title: "No Active Alerts", description: "All applications are within normal parameters", time: "Now" });
    }
    return dynamicAlerts;
  })();

  const displayData = appData
    .filter(a => filterRisk === "all" || a.riskLevel === filterRisk)
    .sort((a, b) => {
      if (sortBy === "risk") return (a.riskScore || 0) - (b.riskScore || 0);
      if (sortBy === "company") return (a.company || "").localeCompare(b.company || "");
      if (sortBy === "amount") return parseInt((b.loanAmount || "").replace(/[^0-9]/g, '')) - parseInt((a.loanAmount || "").replace(/[^0-9]/g, ''));
      return 0; // date default
    })
    .slice(0, 5); // show only 5 on dashboard

  const trendData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthApps = appData.filter(a => {
        const appDate = new Date(a.date);
        return appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
      });
      return {
        month: months[d.getMonth()],
        applications: monthApps.length || Math.floor(Math.random() * 5 + 1),
        highRisk: monthApps.filter(a => a.riskLevel === "high").length,
      };
    });
  })();

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-[#10b981] bg-[#d1fae5] dark:bg-[#00b386]/10 dark:text-[#50ddad] border border-transparent dark:border-[#00b386]/20";
      case "medium":
        return "text-[#f59e0b] bg-[#fef3c7] dark:bg-[#f59e0b]/10 dark:text-[#fbbf24] border border-transparent dark:border-[#f59e0b]/20";
      case "high":
        return "text-[#ef4444] bg-[#fee2e2] dark:bg-[#ef4444]/10 dark:text-[#f87171] border border-transparent dark:border-[#ef4444]/20";
      default:
        return "text-[#737373] bg-[#f5f5f5] dark:bg-white/5 dark:text-[#86948c] border border-transparent dark:border-white/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[#d1fae5] text-[#10b981] dark:bg-[#00b386]/10 dark:text-[#50ddad] border border-transparent dark:border-[#00b386]/20";
      case "Flagged":
        return "bg-[#fee2e2] text-[#ef4444] dark:bg-[#ef4444]/10 dark:text-[#f87171] border border-transparent dark:border-[#ef4444]/20";
      case "Under Review":
        return "bg-[#fef3c7] text-[#f59e0b] dark:bg-[#f59e0b]/10 dark:text-[#fbbf24] border border-transparent dark:border-[#f59e0b]/20";
      case "Processing":
        return "bg-[#e0e7ff] text-[#6366f1] dark:bg-[#6366f1]/10 dark:text-[#818cf8] border border-transparent dark:border-[#6366f1]/20";
      default:
        return "bg-[#f5f5f5] text-[#737373] dark:bg-white/5 dark:text-[#86948c] border border-transparent dark:border-white/10";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-[#ef4444] bg-[#fee2e2] dark:bg-[#ef4444]/10 dark:border-l-[#ef4444]";
      case "warning":
        return "border-l-[#f59e0b] bg-[#fef3c7] dark:bg-[#f59e0b]/10 dark:border-l-[#f59e0b]";
      case "info":
        return "border-l-[#3b82f6] bg-[#dbeafe] dark:bg-[#3b82f6]/10 dark:border-l-[#3b82f6]";
      default:
        return "border-l-[#737373] bg-[#f5f5f5] dark:bg-white/5 dark:border-l-[#86948c]";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <AIChatbot />

        {/* Critical Alert Banner - Sovereign Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] rounded-2xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(239,68,68,0.25)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute top-0 right-[20%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex items-start gap-4 z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">Critical Alert</h3>
                  <span className="text-sm opacity-90">— Requires immediate attention</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">{stats.highRisk} High-Risk Cases</h2>
                <p className="text-sm md:text-base opacity-95">
                  Revenue mismatch detected in 2 companies • AI recommends manual review
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-4 z-10 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className="text-xs opacity-80 uppercase tracking-wider">Last updated</p>
                <p className="text-sm font-medium">2 hours ago</p>
              </div>
              <button
                onClick={() => navigate("/history")}
                className="w-full md:w-auto px-6 py-3 bg-white text-[#b91c1c] font-semibold rounded-xl shadow-md hover:bg-[#fef2f2] hover:shadow-lg transition-all"
              >
                Review Cases →
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row - Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#737373] dark:text-[#86948c]">Total Applications</p>
                <p className="text-3xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{stats.total}</p>
                <p className="text-xs font-medium text-[#00b386] dark:text-[#50ddad] flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#00b386]/20 dark:to-[#059669]/10 rounded-xl flex items-center justify-center shadow-inner">
                <FileText className="w-6 h-6 text-[#00b386] dark:text-[#50ddad]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#737373] dark:text-[#86948c]">High Risk Cases</p>
                <p className="text-3xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{stats.highRisk}</p>
                <p className="text-xs font-medium text-[#ef4444] dark:text-[#f87171] flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#ef4444]/20 dark:to-[#dc2626]/10 rounded-xl flex items-center justify-center shadow-inner">
                <Clock className="w-6 h-6 text-[#ef4444] dark:text-[#f87171]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#737373] dark:text-[#86948c]">Approved Loans</p>
                <p className="text-3xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{stats.approved}</p>
                <p className="text-xs font-medium text-[#00b386] dark:text-[#50ddad] flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {stats.approvalRate}% approval rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] dark:from-[#00b386]/20 dark:to-[#059669]/10 rounded-xl flex items-center justify-center shadow-inner">
                <CheckCircle className="w-6 h-6 text-[#10b981] dark:text-[#50ddad]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#737373] dark:text-[#86948c]">Avg Processing</p>
                <p className="text-3xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">2.4h</p>
                <p className="text-xs font-medium text-[#3b82f6] dark:text-[#60a5fa] flex items-center gap-1 mt-2">
                  <Zap className="w-3.5 h-3.5" />
                  15% faster
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] dark:from-[#3b82f6]/20 dark:to-[#2563eb]/10 rounded-xl flex items-center justify-center shadow-inner">
                <Activity className="w-6 h-6 text-[#3b82f6] dark:text-[#60a5fa]" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Risk Distribution & Real-Time Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Risk Distribution - 2 Columns */}
          <div className="lg:col-span-2 bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Risk Distribution</h3>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#00b386] dark:text-[#50ddad] bg-[#e5f7f3] dark:bg-[#00b386]/10 px-2 py-1 rounded">Portfolio</span>
            </div>
            
            <div className="flex items-center justify-center h-48 relative my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1326', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#dae2fd' }}
                    itemStyle={{ color: '#dae2fd' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#1a1a1a] dark:text-[#dae2fd]">88%</span>
                <span className="text-[#737373] dark:text-[#86948c] text-[10px] uppercase font-bold tracking-widest mt-1">Confidence</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2 px-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: item.color }} />
                    <p className="text-xs uppercase font-semibold text-[#737373] dark:text-[#86948c]">{item.name}</p>
                  </div>
                  <p className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Real Time Alerts - 3 Columns */}
          <div className="lg:col-span-3 bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Real-Time Alerts</h3>
              <div className="w-8 h-8 rounded-full bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#737373] dark:text-[#86948c]" />
              </div>
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-5 rounded-xl border-l-[3px] border-r border-t border-b border-transparent dark:border-y-white/[0.03] dark:border-r-white/[0.03] ${getAlertColor(alert.type)} transition-all hover:shadow-lg backdrop-blur-md relative`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-12">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${alert.type === 'critical' ? 'bg-[#ef4444] text-white' : alert.type === 'warning' ? 'text-[#f59e0b]' : 'text-[#3b82f6]'}`}>
                          {alert.type === 'critical' ? 'Live Critical' : alert.type === 'warning' ? 'System Warning' : 'Processing Queue'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#dae2fd] mb-1">{alert.title}</h4>
                      <p className="text-xs text-[#737373] dark:text-[#86948c] leading-relaxed">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 absolute top-5 right-5">
                      <Clock className="w-3.5 h-3.5 text-[#737373] dark:text-[#86948c]" />
                      <span className="text-[10px] text-[#737373] dark:text-[#86948c] font-medium whitespace-nowrap">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Trends */}
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-[#e5e5e5] dark:border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Application Trends</h3>
              <p className="text-sm text-[#737373] dark:text-[#86948c] mt-0.5">Monthly throughput analysis vs High-Risk trends</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#50ddad]"></div><span className="dark:text-[#86948c]">Total Applications</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div><span className="dark:text-[#86948c]">High Risk</span></div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50ddad" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#50ddad" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-white/5" />
                <XAxis dataKey="month" stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis stroke="#737373" className="dark:stroke-[#86948c]" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1326", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: '#dae2fd', padding: '12px' }}
                  itemStyle={{ fontWeight: 600 }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Line type="monotone" dataKey="applications" stroke="#50ddad" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0b1326', stroke: '#50ddad', strokeWidth: 3 }} name="Total Applications" 
                   // @ts-ignore
                  fill="url(#colorApps)"
                />
                <Line type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0b1326', stroke: '#ef4444', strokeWidth: 3 }} name="High Risk Cases"
                   // @ts-ignore
                  fill="url(#colorRisk)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-white/[0.06] flex items-center justify-between bg-white/50 dark:bg-transparent">
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#737373] dark:from-[#dae2fd] dark:to-[#86948c]">Recent Applications</h2>
              <p className="text-sm text-[#737373] dark:text-[#86948c] mt-1">Track and manage credit risk assessments</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate("/history")}
                className="w-8 h-8 flex items-center justify-center border border-[#e5e5e5] dark:border-white/10 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-colors text-[#737373] dark:text-[#86948c]"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e5] dark:border-white/[0.06] bg-[#fafafa]/50 dark:bg-transparent">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Loan Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                {displayData.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafafa] dark:hover:bg-[#31394d]/40 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded shrink-0 bg-[#e5f7f3] dark:bg-[#131b2e] border border-[#d1fae5] dark:border-white/10 flex items-center justify-center font-bold text-[#00b386] dark:text-[#50ddad] text-xs">
                          {app.company.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{app.riskScore}</span>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getRiskColor(app.riskLevel)}`}>
                          {app.riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-[#1a1a1a] dark:text-[#dae2fd] font-medium">{app.loanAmount}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#737373] dark:text-[#86948c]">
                          {new Date(app.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-[#737373] dark:text-[#86948c]">
                       <button 
                          onClick={() => navigate(`/credit-analysis/${app.id}`)}
                          className="hover:text-[#00b386] dark:hover:text-[#50ddad] transition-colors"
                        >
                          <span className="tracking-widest font-bold">•••</span>
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
