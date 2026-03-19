import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, FileText, MessageSquare, Send, Gauge } from "lucide-react";
import Layout from "../components/Layout";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const riskGaugeData = [
  { name: "Score", value: 56, color: "#f59e0b" },
  { name: "Remaining", value: 44, color: "#e5e5e5" },
];

const comparisonData = [
  { metric: "Profit Margin", company: 12.5, industry: 15.2 },
  { metric: "Debt Ratio", company: 68, industry: 52 },
  { metric: "Liquidity", company: 1.8, industry: 2.1 },
];

export default function ReportPreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I can help you understand this credit risk report. Ask me anything!" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { role: "user", content: inputMessage }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on the analysis, the medium risk classification is primarily due to the 15% GST-Bank mismatch and elevated debt ratio. Would you like me to explain any specific metric?",
        },
      ]);
    }, 1000);
    
    setInputMessage("");
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/credit-analysis/${id}`)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-[#334155] rounded-xl transition-colors border border-[#e5e5e5] dark:border-[#334155]"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
            </button>
            <div>
              <h1 className="text-2xl text-[#1a1a1a] dark:text-white">Credit Risk Report</h1>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">Document preview for {id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="px-6 py-3 border border-[#e5e5e5] dark:border-[#334155] text-[#1a1a1a] dark:text-white rounded-xl hover:bg-[#f5f5f5] dark:hover:bg-[#334155] transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              {chatOpen ? "Hide" : "Ask"} AI
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Report */}
          <div className={`flex-1 transition-all duration-300 ${chatOpen ? "lg:max-w-[65%]" : "max-w-5xl mx-auto"}`}>
            <div className="bg-white dark:bg-[#1e293b] rounded-[24px] shadow-2xl border border-[#e5e5e5] dark:border-[#334155] p-12 space-y-8">
              {/* Header */}
              <div className="text-center border-b border-[#e5e5e5] dark:border-[#334155] pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00b386] to-[#059669] rounded-2xl mb-4 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl text-[#1a1a1a] dark:text-white mb-2">Credit Risk Analysis Report</h2>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Intelli-Credit AI Platform</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">Generated on March 19, 2026</p>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#fafafa] dark:bg-[#334155]/30 rounded-xl">
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Company Name</p>
                    <p className="text-sm text-[#1a1a1a] dark:text-white">TechVista Solutions Pvt Ltd</p>
                  </div>
                  <div className="p-3 bg-[#fafafa] dark:bg-[#334155]/30 rounded-xl">
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Industry</p>
                    <p className="text-sm text-[#1a1a1a] dark:text-white">Information Technology</p>
                  </div>
                  <div className="p-3 bg-[#fafafa] dark:bg-[#334155]/30 rounded-xl">
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Application ID</p>
                    <p className="text-sm text-[#1a1a1a] dark:text-white">{id}</p>
                  </div>
                  <div className="p-3 bg-[#fafafa] dark:bg-[#334155]/30 rounded-xl">
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Analysis Date</p>
                    <p className="text-sm text-[#1a1a1a] dark:text-white">March 19, 2026</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment with Gauge */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Risk Assessment
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Overall Risk Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl text-[#1a1a1a] dark:text-white">56</p>
                        <span className="px-3 py-1 bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f] dark:text-[#fcd34d] rounded-full text-xs">
                          Medium
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-[#e5e5e5] dark:bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] w-[56%] rounded-full" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#737373] dark:text-[#94a3b8]">Confidence Level</span>
                        <span className="text-[#1a1a1a] dark:text-white">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737373] dark:text-[#94a3b8]">Risk Factors</span>
                        <span className="text-[#1a1a1a] dark:text-white">3 Major</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={riskGaugeData}
                          cx="50%"
                          cy="50%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {riskGaugeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Key Findings
                </h3>
                <ul className="space-y-3 text-sm text-[#1a1a1a] dark:text-white">
                  <li className="flex gap-3 p-3 bg-[#fef3c7] dark:bg-[#78350f]/20 rounded-xl">
                    <span className="text-[#f59e0b] text-lg">•</span>
                    <span>15% revenue mismatch detected between GST and bank records</span>
                  </li>
                  <li className="flex gap-3 p-3 bg-[#fee2e2] dark:bg-[#7f1d1d]/20 rounded-xl">
                    <span className="text-[#ef4444] text-lg">•</span>
                    <span>Cash flow irregularities observed in Q3 2025</span>
                  </li>
                  <li className="flex gap-3 p-3 bg-[#d1fae5] dark:bg-[#065f46]/20 rounded-xl">
                    <span className="text-[#10b981] text-lg">•</span>
                    <span>Consistent 18% YoY revenue growth maintained</span>
                  </li>
                  <li className="flex gap-3 p-3 bg-[#fef3c7] dark:bg-[#78350f]/20 rounded-xl">
                    <span className="text-[#f59e0b] text-lg">•</span>
                    <span>Debt ratio (0.68) higher than industry average (0.52)</span>
                  </li>
                </ul>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#0f766e] dark:to-[#065f46] rounded-xl p-4 text-center">
                    <p className="text-xs text-[#00b386] dark:text-[#86efac] mb-1">GST Revenue</p>
                    <p className="text-xl text-[#1a1a1a] dark:text-white">₹1.18 Cr</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a] dark:to-[#1e40af] rounded-xl p-4 text-center">
                    <p className="text-xs text-[#3b82f6] dark:text-[#93c5fd] mb-1">Bank Credits</p>
                    <p className="text-xl text-[#1a1a1a] dark:text-white">₹1.05 Cr</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#7f1d1d] dark:to-[#991b1b] rounded-xl p-4 text-center">
                    <p className="text-xs text-[#ef4444] dark:text-[#fca5a5] mb-1">Difference</p>
                    <p className="text-xl text-[#1a1a1a] dark:text-white">₹13 L</p>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Peer Comparison
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-[#334155]" />
                    <XAxis dataKey="metric" stroke="#737373" className="dark:stroke-[#94a3b8]" />
                    <YAxis stroke="#737373" className="dark:stroke-[#94a3b8]" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="company" fill="#00b386" name="Company" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="industry" fill="#3b82f6" name="Industry Avg" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Explanation */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  AI Analysis Explanation
                </h3>
                <p className="text-sm text-[#1a1a1a] dark:text-white leading-relaxed bg-[#fafafa] dark:bg-[#334155]/30 p-4 rounded-xl">
                  The medium risk classification is primarily driven by a combination of financial inconsistencies and
                  debt exposure. Key concerns include a 15% mismatch between GST-reported revenue and actual bank
                  credits, suggesting potential revenue recognition issues. The debt ratio of 0.68 is higher than the
                  industry average, indicating elevated financial leverage. However, consistent revenue growth and
                  acceptable liquidity ratios partially offset these concerns.
                </p>
              </div>

              {/* Final Decision */}
              <div>
                <h3 className="text-lg text-[#1a1a1a] dark:text-white mb-3 pb-2 border-b border-[#e5e5e5] dark:border-[#334155]">
                  Final Decision
                </h3>
                <div className="bg-gradient-to-br from-[#00b386] to-[#059669] dark:from-[#0f766e] dark:to-[#065f46] rounded-xl p-6 space-y-3 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Recommended Loan Amount</span>
                    <span className="text-2xl">₹35,00,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Risk Level</span>
                    <span className="text-2xl">Medium</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Confidence Score</span>
                    <span className="text-2xl">78%</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-[#e5e5e5] dark:border-[#334155] text-center">
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">
                  This report was generated using Intelli-Credit AI
                </p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                  © 2026 Intelli-Credit AI. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* AI Chat Panel */}
          {chatOpen && (
            <div className="w-96 bg-white dark:bg-[#1e293b] rounded-[24px] shadow-2xl border border-[#e5e5e5] dark:border-[#334155] flex flex-col h-[calc(100vh-200px)] sticky top-6">
              <div className="p-6 border-b border-[#e5e5e5] dark:border-[#334155]">
                <h3 className="text-lg text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00b386]" />
                  Ask AI Assistant
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                  Get instant clarifications about this report
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-[#00b386] to-[#059669] text-white"
                          : "bg-[#f5f5f5] dark:bg-[#334155] text-[#1a1a1a] dark:text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#e5e5e5] dark:border-[#334155]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about the report..."
                    className="flex-1 px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] text-sm text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => setInputMessage("Why is the risk medium?")}
                    className="px-3 py-2 text-xs bg-[#f5f5f5] dark:bg-[#334155] text-[#737373] dark:text-[#94a3b8] rounded-lg hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 hover:text-[#00b386] transition-all"
                  >
                    Why medium risk?
                  </button>
                  <button
                    onClick={() => setInputMessage("Explain debt ratio")}
                    className="px-3 py-2 text-xs bg-[#f5f5f5] dark:bg-[#334155] text-[#737373] dark:text-[#94a3b8] rounded-lg hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 hover:text-[#00b386] transition-all"
                  >
                    Explain debt ratio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
