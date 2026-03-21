import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Layout from "../components/Layout";

const dummyHistory = [
  {
    id: "APP-2024-001",
    company: "TechVista Solutions Pvt Ltd",
    loanAmount: "₹50,00,000",
    riskScore: 72,
    riskLevel: "low",
    status: "Approved",
    date: "2024-03-15",
    analyst: "Rahul Kumar",
  },
  {
    id: "APP-2024-002",
    company: "Global Exports & Trading Co",
    loanAmount: "₹1,20,00,000",
    riskScore: 56,
    riskLevel: "medium",
    status: "Under Review",
    date: "2024-03-14",
    analyst: "Priya Sharma",
  },
  {
    id: "APP-2024-003",
    company: "Urban Construction Ltd",
    loanAmount: "₹3,00,00,000",
    riskScore: 31,
    riskLevel: "high",
    status: "Flagged",
    date: "2024-03-13",
    analyst: "Amit Patel",
  },
  {
    id: "APP-2024-004",
    company: "Fresh Farms Agriculture",
    loanAmount: "₹75,00,000",
    riskScore: 68,
    riskLevel: "low",
    status: "Approved",
    date: "2024-03-12",
    analyst: "Rahul Kumar",
  },
  {
    id: "APP-2024-005",
    company: "Retail Chain Ventures",
    loanAmount: "₹2,50,00,000",
    riskScore: 45,
    riskLevel: "medium",
    status: "Processing",
    date: "2024-03-11",
    analyst: "Priya Sharma",
  },
];

export default function History() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>(dummyHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApplications([...data, ...dummyHistory]);
        }
      })
      .catch((err) => console.error("Failed to fetch applications:", err));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/applications/${id}`, { method: "DELETE" });
      setApplications(applications.filter((app) => app.id !== id));
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "flagged":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-amber-700 bg-amber-50 border-amber-200";
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesRisk = filterRisk === "all" || app.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = [
    { label: "Total", value: applications.length, icon: FileText, color: "bg-primary-container" },
    { label: "Approved", value: applications.filter((a) => a.status?.toLowerCase() === "approved").length, icon: CheckCircle, color: "bg-emerald-500" },
    { label: "Pending", value: applications.filter((a) => ["under review", "processing"].includes(a.status?.toLowerCase())).length, icon: Clock, color: "bg-amber-500" },
    { label: "Flagged", value: applications.filter((a) => a.status?.toLowerCase() === "flagged").length, icon: AlertTriangle, color: "bg-red-500" },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-surface min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-headline">Application History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all credit risk assessments
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-xl hover:bg-surface-container-low transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-on-surface mt-1 font-headline">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="under review">Under Review</option>
            <option value="processing">Processing</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Application
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
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredApps.map((app) => (
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
                      <span className="text-lg font-bold text-on-surface">{app.riskScore}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRiskColor(app.riskLevel)}`}>
                        {app.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{app.date}</td>
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-outline-variant/20">
            <p className="text-sm text-muted-foreground">
              Showing {filteredApps.length} of {applications.length} applications
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">2</button>
              <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">3</button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
