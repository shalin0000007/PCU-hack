import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Database, FileSpreadsheet, Building2 } from "lucide-react";
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

  const handleFileChange = (field: "gstFile" | "bankFile", file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleUseSampleData = () => {
    setFormData({
      companyName: "TechVista Solutions Pvt Ltd",
      industry: "Information Technology",
      loanAmount: "5000000",
      purpose: "Business expansion and equipment purchase",
      gstFile: null,
      bankFile: null,
      externalCompany: "TechVista Solutions",
    });
  };

  const handleStartAnalysis = () => {
    const appId = "APP-2024-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    navigate(`/analysis-process/${appId}`);
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
            <h1 className="text-2xl text-[#1a1a1a] dark:text-white">New Loan Application</h1>
            <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">Enter company details and upload financial data</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e5e5e5] dark:border-[#334155]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#0f766e] dark:to-[#065f46] rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#00b386]" />
              </div>
              <div>
                <h2 className="text-lg text-[#1a1a1a] dark:text-white">Company Information</h2>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Basic details about the applicant company</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent transition-all text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent transition-all text-[#1a1a1a] dark:text-white"
                >
                  <option value="">Select industry</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Construction">Construction</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  placeholder="Enter loan amount"
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent transition-all text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">Purpose</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Purpose of loan"
                  className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent transition-all text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e5e5e5] dark:border-[#334155]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a] dark:to-[#1e40af] rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <h2 className="text-lg text-[#1a1a1a] dark:text-white">Data Upload</h2>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Upload GST and bank statement CSV files</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">GST Returns (CSV)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange("gstFile", e.target.files?.[0] || null)}
                    className="hidden"
                    id="gst-upload"
                  />
                  <label
                    htmlFor="gst-upload"
                    className="flex items-center gap-3 px-4 py-4 bg-[#f5f5f5] dark:bg-[#334155] border-2 border-dashed border-[#e5e5e5] dark:border-[#475569] rounded-xl cursor-pointer hover:border-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 transition-all"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
                    <span className="text-sm text-[#737373] dark:text-[#94a3b8]">
                      {formData.gstFile ? formData.gstFile.name : "Choose GST CSV file"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#1a1a1a] dark:text-white">Bank Statements (CSV)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange("bankFile", e.target.files?.[0] || null)}
                    className="hidden"
                    id="bank-upload"
                  />
                  <label
                    htmlFor="bank-upload"
                    className="flex items-center gap-3 px-4 py-4 bg-[#f5f5f5] dark:bg-[#334155] border-2 border-dashed border-[#e5e5e5] dark:border-[#475569] rounded-xl cursor-pointer hover:border-[#00b386] hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 transition-all"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
                    <span className="text-sm text-[#737373] dark:text-[#94a3b8]">
                      {formData.bankFile ? formData.bankFile.name : "Choose Bank CSV file"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e5e5e5] dark:border-[#334155]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#fef3c7] to-[#fde68a] dark:from-[#78350f] dark:to-[#92400e] rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <h2 className="text-lg text-[#1a1a1a] dark:text-white">External Data</h2>
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">Fetch additional data from external sources</p>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={formData.externalCompany}
                onChange={(e) => setFormData({ ...formData, externalCompany: e.target.value })}
                placeholder="Enter company name for external data"
                className="flex-1 px-4 py-3 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] focus:border-transparent transition-all text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8]"
              />
              <button className="px-6 py-3 bg-white dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] text-[#1a1a1a] dark:text-white rounded-xl hover:border-[#00b386] hover:text-[#00b386] transition-all">
                Fetch Data
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-[#e5e5e5] dark:border-[#334155]">
            <button
              onClick={handleUseSampleData}
              className="px-6 py-3 bg-white dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] text-[#1a1a1a] dark:text-white rounded-xl hover:border-[#00b386] hover:text-[#00b386] transition-all"
            >
              Use Sample Data
            </button>
            <button
              onClick={handleStartAnalysis}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Start Analysis →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}