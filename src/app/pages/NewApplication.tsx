import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Database, FileSpreadsheet, Building2, CloudUpload } from "lucide-react";
import Layout from "../components/Layout";

export default function NewApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    loanAmount: "",
    purpose: "",
    gstFile: null as File | null,
    bankFile: null as File | null,
    externalCompany: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);

  const handleFileChange = (field: "gstFile" | "bankFile", file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleFetchData = async () => {
    const company = formData.externalCompany || formData.companyName;
    if (!company) {
      alert("Please enter a company name first.");
      return;
    }
    setFetchStatus("Fetching news and market data...");
    try {
      const res = await fetch(`http://localhost:8000/api/news?company=${encodeURIComponent(company)}`);
      const data = await res.json();
      if (data.news && data.news.length > 0) {
        setFetchStatus(`✅ Found ${data.news.length} news articles for ${company}`);
      } else {
        setFetchStatus(`ℹ️ No recent news found for ${company}. Analysis will proceed with financial data.`);
      }
    } catch (err) {
      setFetchStatus("⚠️ Could not connect to news service. Analysis will still work.");
    }
  };

  const handleUseSampleData = () => {
    setFormData({
      companyName: "Quantum Dynamics Corp",
      industry: "Technology",
      loanAmount: "5000000",
      purpose: "Working Capital",
      gstFile: null,
      bankFile: null,
      externalCompany: "Quantum Dynamics",
    });
  };

  const handleStartAnalysis = async () => {
    if (!formData.companyName || !formData.loanAmount) {
      alert("Please enter at least the company name and loan amount.");
      return;
    }

    const data = new FormData();
    data.append("company_name", formData.companyName);
    data.append("industry", formData.industry);
    data.append("loan_amount", formData.loanAmount.toString());
    data.append("purpose", formData.purpose);
    if (formData.externalCompany) data.append("external_company", formData.externalCompany);
    if (formData.gstFile) data.append("gst_file", formData.gstFile);
    if (formData.bankFile) data.append("bank_file", formData.bankFile);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (response.ok && result.application_id) {
        navigate(`/credit-analysis/${result.application_id}`);
      } else {
        alert("Failed to start analysis: " + (result.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("Failed to connect to the backend server. Please make sure the FastAPI server is running.");
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] dark:hover:bg-white/5 rounded-xl transition-colors border border-[#e5e5e5] dark:border-white/[0.06] backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373] dark:text-[#86948c]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#737373] dark:from-[#dae2fd] dark:to-[#86948c]">New Credit Application</h1>
              <p className="text-sm text-[#737373] dark:text-[#86948c] mt-1">Submit a new application for AI-powered risk analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 hidden md:flex">
             <button
                onClick={handleUseSampleData}
                className="px-5 py-2 bg-transparent border border-[#00b386] dark:border-[#50ddad] text-[#00b386] dark:text-[#50ddad] font-medium rounded-xl hover:bg-[#00b386]/10 transition-all text-sm"
              >
                Use Sample Data
              </button>
             <button
                onClick={handleFetchData}
                className="px-5 py-2 bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] font-bold rounded-xl shadow-[0_4px_14px_rgba(0,179,134,0.3)] hover:shadow-[0_6px_20px_rgba(0,179,134,0.4)] transition-all text-sm"
              >
                Fetch External Data
              </button>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-8 space-y-8">
          
          {/* Company Information Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e5e5e5] dark:border-white/[0.06]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#00b386]/20 dark:to-[#059669]/10 rounded-xl flex items-center justify-center border border-transparent dark:border-[#00b386]/20">
                <Building2 className="w-5 h-5 text-[#00b386] dark:text-[#50ddad]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Company Information</h2>
                <p className="text-sm text-[#737373] dark:text-[#86948c]">Basic details about the applicant company</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Quantum Dynamics Corp"
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] placeholder:text-[#737373] dark:placeholder:text-[#3c4a43] text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Loan Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c4a43]">₹</span>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] placeholder:text-[#737373] dark:placeholder:text-[#3c4a43] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] text-sm"
                >
                  <option value="">Select industry</option>
                  <option value="Information Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Construction">Construction</option>
                  <option value="Finance">Finance</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Mining">Mining / Energy</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Loan Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] text-sm"
                >
                  <option value="">Select purpose</option>
                  <option value="Working Capital">Working Capital</option>
                  <option value="Expansion">Expansion</option>
                  <option value="Equipment">Equipment Purchase</option>
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Project Finance">Project Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-6 pt-2">
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Financial Documents</h2>
              <p className="text-sm text-[#737373] dark:text-[#86948c]">Upload GST returns and bank statements for analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GST Upload */}
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv,.pdf,.xls"
                  onChange={(e) => handleFileChange("gstFile", e.target.files?.[0] || null)}
                  className="hidden"
                  id="gst-upload"
                />
                <label
                  htmlFor="gst-upload"
                  className="flex flex-col items-center justify-center gap-3 p-8 bg-[#f5f5f5] dark:bg-[#060e20] border-2 border-dashed border-[#e5e5e5] dark:border-[#334155] rounded-2xl cursor-pointer hover:border-[#00b386] dark:hover:border-[#50ddad] transition-all group-hover:bg-[#e5f7f3] dark:group-hover:bg-[#00b386]/5"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#131b2e] flex items-center justify-center shadow-sm">
                    <CloudUpload className="w-6 h-6 text-[#737373] dark:text-[#50ddad]" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-[#1a1a1a] dark:text-[#dae2fd] mb-1">
                      {formData.gstFile ? formData.gstFile.name : "GST Returns"}
                    </span>
                    <span className="block text-xs text-[#737373] dark:text-[#86948c]">
                      Drag and drop or click to upload
                    </span>
                    <span className="block text-[10px] text-[#737373] dark:text-[#3c4a43] mt-2 uppercase tracking-wider">
                      Formats: PDF, CSV, XLS (max 10MB)
                    </span>
                  </div>
                </label>
              </div>

              {/* Bank Upload */}
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv,.pdf,.xls"
                  onChange={(e) => handleFileChange("bankFile", e.target.files?.[0] || null)}
                  className="hidden"
                  id="bank-upload"
                />
                <label
                  htmlFor="bank-upload"
                  className="flex flex-col items-center justify-center gap-3 p-8 bg-[#f5f5f5] dark:bg-[#060e20] border-2 border-dashed border-[#e5e5e5] dark:border-[#334155] rounded-2xl cursor-pointer hover:border-[#00b386] dark:hover:border-[#50ddad] transition-all group-hover:bg-[#e5f7f3] dark:group-hover:bg-[#00b386]/5"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#131b2e] flex items-center justify-center shadow-sm">
                    <CloudUpload className="w-6 h-6 text-[#737373] dark:text-[#50ddad]" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-[#1a1a1a] dark:text-[#dae2fd] mb-1">
                      {formData.bankFile ? formData.bankFile.name : "Bank Statements"}
                    </span>
                    <span className="block text-xs text-[#737373] dark:text-[#86948c]">
                      Drag and drop or click to upload
                    </span>
                    <span className="block text-[10px] text-[#737373] dark:text-[#3c4a43] mt-2 uppercase tracking-wider">
                      Formats: PDF, CSV, XLS (max 10MB)
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Additional Information</label>
                <textarea
                  rows={4}
                  placeholder="Mention any specific credit requirements or additional context for the AI engine..."
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] placeholder:text-[#737373] dark:placeholder:text-[#3c4a43] text-sm resize-none"
                />
              </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 mt-4 border-t border-[#e5e5e5] dark:border-white/[0.06]">
            <button
               onClick={() => navigate("/dashboard")}
               className="px-8 py-3.5 text-[#1a1a1a] dark:text-[#dae2fd] font-medium rounded-xl hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleStartAnalysis}
              className="px-8 py-3.5 bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] font-bold rounded-xl shadow-[0_4px_14px_rgba(0,179,134,0.3)] hover:shadow-[0_6px_20px_rgba(0,179,134,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>Submit for Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}