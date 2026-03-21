import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Download,
  Plus,
  Filter,
  LayoutGrid,
  FileText,
  Clock,
  AlertTriangle,
  Timer,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import Layout from "../components/Layout";

const dummyHistoryData = [
  {
    id: "APP-8842-X",
    company: "Vanguard Logistics",
    initial: "V",
    riskScore: 25,
    riskLevel: "low",
    date: "2023-10-24",
    status: "Approved",
  },
  {
    id: "APP-9102-L",
    company: "Horizon FinTech",
    initial: "H",
    riskScore: 85,
    riskLevel: "high",
    date: "2023-10-26",
    status: "In Review",
  },
  {
    id: "APP-7231-M",
    company: "Solaris Energy",
    initial: "S",
    riskScore: 55,
    riskLevel: "medium",
    date: "2023-10-27",
    status: "Rejected",
  },
  {
    id: "APP-4552-K",
    company: "Pinnacle Peaks",
    initial: "P",
    riskScore: 30,
    riskLevel: "low",
    date: "2023-10-28",
    status: "Approved",
  },
];

export default function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<any[]>(dummyHistoryData);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistoryData([...data, ...dummyHistoryData]);
        }
      })
      .catch((err) => console.error("Failed to fetch history:", err));
  }, []);

  const getRiskBar = (level: string, score: number) => {
    const colors = {
      low: "bg-tertiary",
      medium: "bg-amber-500",
      high: "bg-error",
    };
    const width = level === "low" ? "30%" : level === "medium" ? "60%" : "90%";
    return (
      <div className="flex items-center gap-3">
        <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colors[level as keyof typeof colors] || "bg-outline-variant"}`}
            style={{ width }}
          />
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded ${
            level === "low"
              ? "bg-tertiary-container text-on-tertiary-container"
              : level === "medium"
              ? "bg-amber-100 text-amber-700"
              : "bg-error-container text-on-error-container"
          }`}
        >
          {level.toUpperCase()} RISK
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Approved: "text-tertiary",
      Rejected: "text-error",
      "In Review": "text-amber-600",
      "Under Review": "text-amber-600",
    };
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${styles[status] || "text-muted-foreground"}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-['Inter'] uppercase tracking-wider">
              <span>Portfolio</span>
              <span>›</span>
              <span className="text-foreground">Application History</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight font-['Manrope']">Application History</h1>
            <p className="text-muted-foreground mt-1 font-['Inter']">
              Detailed audit trail of all institutional credit requests and historical performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-foreground hover:bg-surface-container transition-colors font-['Inter']">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => navigate("/new-application")}
              className="flex items-center gap-2 px-5 py-2.5 bg-tertiary text-tertiary-foreground rounded-xl text-sm hover:opacity-90 transition-all font-['Inter'] font-medium"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-tertiary-container rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-tertiary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground font-['Inter']">Total Managed</span>
                  <span className="text-xs text-tertiary font-semibold">+12.5% ↗</span>
                </div>
                <p className="text-2xl font-bold text-foreground font-['Manrope']">$428.5M</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">Under Review</p>
                <p className="text-2xl font-bold text-foreground font-['Manrope']">
                  42 <span className="text-sm font-normal text-muted-foreground">Requests</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-error-container rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-['Inter']">High Risk Flag</p>
                <p className="text-2xl font-bold text-error font-['Manrope']">08</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-tertiary-container rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-tertiary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground font-['Inter']">Avg Decision Time</span>
                  <span className="text-xs text-outline-variant">Last 30 Days</span>
                </div>
                <p className="text-2xl font-bold text-foreground font-['Manrope']">
                  4.2 <span className="text-sm font-normal text-muted-foreground">Days</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_32px_rgba(42,52,57,0.06)] overflow-hidden">
          {/* Table Header/Filters */}
          <div className="p-5 border-b border-outline-variant/20">
            <div className="flex items-center justify-between">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                {["All Applications", "Flagged", "Archived"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-['Inter'] ${
                      activeTab === tab.toLowerCase() ||
                      (activeTab === "all" && tab === "All Applications")
                        ? "bg-surface-container-lowest text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-outline-variant font-['Inter']">FILTERS:</span>
                <select className="px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-['Inter']">
                  <option>Status: All</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>In Review</option>
                </select>
                <select className="px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-['Inter']">
                  <option>Risk: All</option>
                  <option>Low Risk</option>
                  <option>Medium Risk</option>
                  <option>High Risk</option>
                </select>
                <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden">
                  <button className="p-2 hover:bg-surface-container transition-colors">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-surface-container transition-colors border-l border-outline-variant/30">
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Submission Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {historyData.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-foreground font-['Inter']">{app.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {app.initial || app.company?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-foreground font-['Inter']">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRiskBar(app.riskLevel, app.riskScore)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground font-['Inter']">
                        {new Date(app.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/credit-analysis/${app.id}`)}
                        className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-outline-variant" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-['Inter']">
              Showing <span className="font-semibold">1-10</span> of{" "}
              <span className="font-semibold">1,240</span> applications
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-outline-variant" />
              </button>
              {[1, 2, 3, "...", 124].map((page, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors font-['Inter'] ${
                    page === 1
                      ? "bg-tertiary text-tertiary-foreground"
                      : "text-muted-foreground hover:bg-surface-container"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-outline-variant" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}