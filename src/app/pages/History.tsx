import { useNavigate } from "react-router";
import { ArrowLeft, Download, Eye } from "lucide-react";
import Layout from "../components/Layout";

const historyData = [
  {
    id: "APP-2024-001",
    company: "TechVista Solutions Pvt Ltd",
    riskScore: 72,
    riskLevel: "low",
    date: "2026-03-15",
    status: "Approved",
  },
  {
    id: "APP-2024-002",
    company: "Global Exports & Trading Co",
    riskScore: 56,
    riskLevel: "medium",
    date: "2026-03-12",
    status: "Under Review",
  },
  {
    id: "APP-2024-003",
    company: "Urban Construction Ltd",
    riskScore: 31,
    riskLevel: "high",
    date: "2026-03-10",
    status: "Rejected",
  },
  {
    id: "APP-2024-004",
    company: "Fresh Farms Agriculture",
    riskScore: 68,
    riskLevel: "low",
    date: "2026-03-08",
    status: "Approved",
  },
  {
    id: "APP-2024-005",
    company: "Retail Chain Ventures",
    riskScore: 45,
    riskLevel: "medium",
    date: "2026-03-05",
    status: "Under Review",
  },
  {
    id: "APP-2024-006",
    company: "Innovative Software Labs",
    riskScore: 78,
    riskLevel: "low",
    date: "2026-03-02",
    status: "Approved",
  },
  {
    id: "APP-2024-007",
    company: "Metro Logistics Services",
    riskScore: 52,
    riskLevel: "medium",
    date: "2026-02-28",
    status: "Approved",
  },
  {
    id: "APP-2024-008",
    company: "Premier Manufacturing Inc",
    riskScore: 38,
    riskLevel: "high",
    date: "2026-02-25",
    status: "Rejected",
  },
];

export default function History() {
  const navigate = useNavigate();

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
        return "text-[#10b981] bg-[#d1fae5] dark:bg-[#065f46] dark:text-[#86efac]";
      case "Rejected":
        return "text-[#ef4444] bg-[#fee2e2] dark:bg-[#7f1d1d] dark:text-[#fca5a5]";
      case "Under Review":
        return "text-[#f59e0b] bg-[#fef3c7] dark:bg-[#78350f] dark:text-[#fcd34d]";
      default:
        return "text-[#737373] bg-[#f5f5f5] dark:bg-[#334155] dark:text-[#94a3b8]";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-[#334155] rounded-xl transition-colors border border-[#e5e5e5] dark:border-[#334155]"
          >
            <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
          </button>
          <div>
            <h1 className="text-2xl text-[#1a1a1a] dark:text-white">Application History</h1>
            <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">View all past credit risk assessments</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155]">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg text-[#1a1a1a] dark:text-white">All Applications</h2>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">
                  {historyData.length} total applications processed
                </p>
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386] text-[#1a1a1a] dark:text-white">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Under Review</option>
                </select>
                <select className="px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386] text-[#1a1a1a] dark:text-white">
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
                <tr className="border-b border-[#e5e5e5] dark:border-[#334155]">
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-[#737373] dark:text-[#94a3b8] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#334155]">
                {historyData.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafafa] dark:hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#1a1a1a] dark:text-white">{app.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#1a1a1a] dark:text-white">{app.company}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#1a1a1a] dark:text-white">{app.riskScore}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getRiskColor(app.riskLevel)}`}
                        >
                          {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#737373] dark:text-[#94a3b8]">
                        {new Date(app.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/credit-analysis/${app.id}`)}
                          className="px-3 py-1.5 text-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/report/${app.id}`)}
                          className="px-3 py-1.5 text-[#737373] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#334155] rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Report
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