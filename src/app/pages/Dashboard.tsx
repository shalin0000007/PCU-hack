import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Layout from "../components/Layout";
import AIChatbot from "../components/AIChatbot";
import { useAuth } from "../contexts/AuthContext";
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

const API_URL = "http://localhost:8000/api";

const trendData = [
  { day: "MON", volume: 180, risk: 20 },
  { day: "TUE", volume: 220, risk: 35 },
  { day: "WED", volume: 200, risk: 28 },
  { day: "THU", volume: 280, risk: 45 },
  { day: "FRI", volume: 250, risk: 38 },
  { day: "SAT", volume: 190, risk: 22 },
  { day: "SUN", volume: 210, risk: 30 },
];

const staticAlerts = [
  {
    id: 1,
    type: "critical",
    title: "High Risk Detection",
    description: "New applications flagged for manual review based on AI analysis.",
    badge: "CRITICAL",
    badgeColor: "bg-error",
    time: "2m ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Income Discrepancy",
    description: "Cross-check with GST records shows variance in reported earnings.",
    badge: "MANUAL CHECK",
    badgeColor: "bg-amber-500",
    time: "16m ago",
  },
  {
    id: 3,
    type: "success",
    title: "Analysis Complete",
    description: "3 new applications processed and ready for review.",
    time: "1h ago",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, getAuthHeaders } = useAuth();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    approved: 0,
    approvalRate: 0,
    riskDist: [
      { name: "Low Risk", value: 65, color: "#10b981" },
      { name: "Medium Risk", value: 25, color: "#f59e0b" },
      { name: "High Risk", value: 10, color: "#ef4444" },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [alerts] = useState(staticAlerts);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const headers = getAuthHeaders();
      
      try {
        // Fetch dashboard stats
        const statsRes = await fetch(`${API_URL}/dashboard-stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData) {
          setStats({
            total: statsData.total || 0,
            highRisk: statsData.highRisk || 0,
            approved: statsData.approved || 0,
            approvalRate: statsData.approvalRate || 0,
            riskDist: statsData.riskDist?.length > 0 ? statsData.riskDist : stats.riskDist,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }

      try {
        // Fetch applications
        const appsRes = await fetch(`${API_URL}/applications`, { headers });
        const appsData = await appsRes.json();
        if (Array.isArray(appsData)) {
          setApplications(appsData);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setApplications(applications.filter((app) => app.id !== id));
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "text-emerald-700 bg-emerald-100";
      case "medium":
        return "text-amber-700 bg-amber-100";
      case "high":
        return "text-red-700 bg-red-100";
      default:
        return "text-slate-700 bg-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "flagged":
        return "text-red-700 bg-red-50 border-red-200";
      case "under review":
      case "processing":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const statCards = [
    {
      label: "Total Applications",
      value: stats.total.toString(),
      icon: FileText,
      color: "bg-primary-container text-white",
    },
    {
      label: "Approved",
      value: stats.approved.toString(),
      icon: CheckCircle,
      color: "bg-emerald-500 text-white",
    },
    {
      label: "Approval Rate",
      value: `${stats.approvalRate}%`,
      icon: TrendingUp,
      color: "bg-blue-500 text-white",
    },
    {
      label: "High Risk",
      value: stats.highRisk.toString(),
      icon: AlertTriangle,
      color: "bg-red-500 text-white",
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-surface min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-headline">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user?.name || "Analyst"}. Monitor your credit risk assessments.
            </p>
          </div>
          <button
            onClick={() => navigate("/new-application")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            New Application
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-on-surface mt-1 font-headline">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h3 className="text-lg font-semibold text-on-surface mb-4 font-headline">Risk Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.riskDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stats.riskDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {stats.riskDist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Trend */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h3 className="text-lg font-semibold text-on-surface mb-4 font-headline">Weekly Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6c7a71" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6c7a71" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-on-surface font-headline">Recent Alerts</h3>
            <span className="text-xs text-muted-foreground">Last 24 hours</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === "critical"
                    ? "border-l-red-500 bg-red-50"
                    : alert.type === "warning"
                    ? "border-l-amber-500 bg-amber-50"
                    : "border-l-emerald-500 bg-emerald-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-on-surface">{alert.title}</h4>
                      {alert.badge && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${alert.badgeColor}`}
                        >
                          {alert.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-on-surface font-headline">Recent Applications</h3>
            {isLoading && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Loading...
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {applications.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                      No applications found. Create a new application to get started.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-on-surface">{app.company}</p>
                          <p className="text-xs text-muted-foreground">{app.id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-on-surface font-medium">{app.loanAmount}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-on-surface">{app.riskScore || "-"}</span>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRiskColor(app.riskLevel)}`}
                          >
                            {app.riskLevel || "pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/credit-analysis/${app.id}`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AIChatbot />
    </Layout>
  );
}
