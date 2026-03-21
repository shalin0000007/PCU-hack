import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";

export default function History() {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/applications`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status?.toLowerCase() === statusFilter;
    const matchesRisk = riskFilter === "all" || app.riskLevel?.toLowerCase() === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.status?.toLowerCase() === "approved").length,
    rejected: applications.filter((a) => a.status?.toLowerCase() === "rejected").length,
    pending: applications.filter((a) => a.status?.toLowerCase() === "under review" || a.status?.toLowerCase() === "processing").length,
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-surface min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-headline">Application History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your credit applications
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, icon: FileText, color: "bg-primary/10 text-primary" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-100 text-red-600" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "bg-amber-100 text-amber-600" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface font-headline">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under review">Under Review</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Risk</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Clock className="w-8 h-8 text-primary animate-pulse mx-auto mb-3" />
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-lg font-medium text-on-surface mb-1">No applications found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" || riskFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Submit a new application to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
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
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-on-surface">{app.company}</p>
                          <p className="text-xs text-muted-foreground">{app.id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {app.date || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-on-surface">{app.loanAmount}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {app.riskScore > 50 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className="font-bold text-on-surface">{app.riskScore || "—"}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRiskColor(app.riskLevel)}`}>
                            {app.riskLevel || "pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="text-sm text-on-surface">{app.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => navigate(`/credit-analysis/${app.id}`)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
