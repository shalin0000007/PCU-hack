import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Download, Eye, Trash2, Search } from "lucide-react";
import Layout from "../components/Layout";

export default function History() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterRisk, setFilterRisk] = useState("All Risk Levels");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'https://credintel-backend.onrender.com'}/api/applications`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistoryData(data);
      })
      .catch(err => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = historyData.filter(app => {
    const statusMatch = filterStatus === "All Status" || app.status === filterStatus;
    const riskMatch = filterRisk === "All Risk Levels" || app.riskLevel === filterRisk.split(" ")[0].toLowerCase();
    const searchMatch = !searchTerm || 
      (app.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && riskMatch && searchMatch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://credintel-backend.onrender.com'}/api/applications/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setHistoryData(prev => prev.filter(app => app.id !== id));
      } else {
        alert("Failed to delete application");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

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
        return "text-[#10b981] bg-[#d1fae5] dark:bg-[#00b386]/10 dark:text-[#50ddad] border border-transparent dark:border-[#00b386]/20";
      case "Rejected":
        return "text-[#ef4444] bg-[#fee2e2] dark:bg-[#ef4444]/10 dark:text-[#f87171] border border-transparent dark:border-[#ef4444]/20";
      case "Under Review":
        return "text-[#f59e0b] bg-[#fef3c7] dark:bg-[#f59e0b]/10 dark:text-[#fbbf24] border border-transparent dark:border-[#f59e0b]/20";
      default:
        return "text-[#737373] bg-[#f5f5f5] dark:bg-white/5 dark:text-[#86948c] border border-transparent dark:border-white/10";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-white/5 rounded-xl transition-colors border border-[#e5e5e5] dark:border-white/[0.06] backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#86948c]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#737373] dark:from-[#dae2fd] dark:to-[#86948c]">Application History</h1>
            <p className="text-sm text-[#737373] dark:text-[#86948c] mt-1">View all past credit risk assessments</p>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06]">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-white/[0.06]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">All Applications</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#e5f7f3] dark:bg-[#00b386]/10 text-[#00b386] dark:text-[#50ddad] text-xs font-semibold">
                    {filteredData.length} total
                  </span>
                  <p className="text-sm text-[#737373] dark:text-[#86948c]">applications processed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] dark:text-[#86948c]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="pl-9 pr-3 py-2 w-48 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 transition-all text-[#1a1a1a] dark:text-[#dae2fd] placeholder:text-[#737373] dark:placeholder:text-[#86948c]"
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 transition-all text-[#1a1a1a] dark:text-[#dae2fd]">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Under Review</option>
                  <option>Flagged</option>
                </select>
                <select 
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-4 py-2 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 transition-all text-[#1a1a1a] dark:text-[#dae2fd]">
                  <option>All Risk Levels</option>
                  <option>Low Risk</option>
                  <option>Medium Risk</option>
                  <option>High Risk</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e5] dark:border-white/[0.06]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#737373] dark:text-[#86948c] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                {filteredData.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafafa] dark:hover:bg-[#31394d]/40 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">{app.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">{app.company}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#dae2fd]">{app.riskScore}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${getRiskColor(app.riskLevel)}`}
                        >
                          {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-[#737373] dark:text-[#86948c]">
                        {new Date(app.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/credit-analysis/${app.id}`)}
                          className="p-2 text-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#00b386]/20 rounded-lg transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/report/${app.id}`)}
                          className="p-2 text-[#737373] dark:text-[#86948c] hover:bg-[#f5f5f5] dark:hover:bg-white/10 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-[#ef4444] hover:bg-[#fee2e2] dark:hover:bg-[#ef4444]/20 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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