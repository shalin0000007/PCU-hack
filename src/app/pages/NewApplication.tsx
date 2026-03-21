import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  ChevronDown,
  FileText,
  Landmark,
  Shield,
  MessageSquare,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Layout from "../components/Layout";

export default function NewApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "Technology & Infrastructure",
    taxRegistration: "",
    loanAmount: "0.00",
    purpose: "Working Capital",
    gstFile: null as File | null,
    bankFile: null as File | null,
  });

  const [applicationIntegrity, setApplicationIntegrity] = useState(94);

  const handleFileChange = (field: "gstFile" | "bankFile", file: File | null) => {
    setFormData({ ...formData, [field]: file });
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
    if (formData.gstFile) data.append("gst_file", formData.gstFile);
    if (formData.bankFile) data.append("bank_file", formData.bankFile);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (response.ok && result.application_id) {
        navigate(`/analysis-process/${result.application_id}`);
      } else {
        alert("Failed to start analysis: " + (result.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-['Inter'] uppercase tracking-wider">
              <span>Applications</span>
              <span>›</span>
              <span className="text-foreground">New Credit Request</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight font-['Manrope']">Initiate New Credit Application</h1>
            <p className="text-muted-foreground mt-1 font-['Inter']">
              Systematic onboarding for corporate credit facilities. Ensure all data pillars are populated
              for the Sovereign Analysis engine.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-tertiary-container rounded-full">
            <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-on-tertiary-container font-['Inter']">Analysis Engine: Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="col-span-2 space-y-6">
            {/* Company Profile Section */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-tertiary-container rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-['Manrope']">Company Profile</h2>
                  <p className="text-sm text-muted-foreground font-['Inter']">Legal entity identity and operational context</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter legal business name"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Industry Sector
                  </label>
                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                    >
                      <option>Technology & Infrastructure</option>
                      <option>Manufacturing</option>
                      <option>Retail & E-commerce</option>
                      <option>Financial Services</option>
                      <option>Healthcare</option>
                      <option>Real Estate</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Tax Registration (GST/VAT)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.taxRegistration}
                      onChange={(e) => setFormData({ ...formData, taxRegistration: e.target.value })}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="flex-1 px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                    />
                    <button className="px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-semibold text-foreground hover:bg-surface-container transition-colors font-['Inter']">
                      Verify Entity
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Parameters Section */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-['Manrope']">Financial Parameters</h2>
                  <p className="text-sm text-muted-foreground font-['Inter']">Defining the scope and intent of the credit facility</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Loan Amount Requested
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="text"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                    Facility Purpose
                  </label>
                  <div className="relative">
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                    >
                      <option>Working Capital</option>
                      <option>Equipment Purchase</option>
                      <option>Business Expansion</option>
                      <option>Debt Consolidation</option>
                      <option>Real Estate</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Bar */}
            <div className="bg-gradient-to-r from-surface-container-low to-tertiary-container/30 rounded-2xl p-4 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-tertiary to-tertiary/80 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-tertiary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-['Manrope']">AI Assistant is monitoring input quality...</p>
                    <p className="text-xs text-muted-foreground font-['Inter']">Automated parsing of financial documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-['Inter']">
                    <span className="w-1.5 h-1.5 bg-outline-variant rounded-full" />
                    GUIDANCE
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-['Inter']">
                    <RefreshCw className="w-4 h-4" />
                    SIMILAR DEALS
                  </button>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* GST Returns */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 font-['Manrope']">GST Returns</h3>
                  <p className="text-xs text-muted-foreground mb-4 font-['Inter']">Latest 12 Months (PDF/JSON)</p>
                  <input
                    type="file"
                    accept=".csv,.pdf,.json"
                    onChange={(e) => handleFileChange("gstFile", e.target.files?.[0] || null)}
                    className="hidden"
                    id="gst-upload"
                  />
                  <label
                    htmlFor="gst-upload"
                    className="px-4 py-2 text-sm font-semibold text-tertiary hover:text-tertiary/80 cursor-pointer font-['Inter']"
                  >
                    {formData.gstFile ? formData.gstFile.name : "BROWSE FILES"}
                  </label>
                </div>
              </div>

              {/* Bank Statements */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-tertiary-container rounded-xl flex items-center justify-center mb-4">
                    <Landmark className="w-6 h-6 text-tertiary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 font-['Manrope']">Bank Statements</h3>
                  <p className="text-xs text-muted-foreground mb-4 font-['Inter']">All Primary Accounts (e-Statements)</p>
                  <input
                    type="file"
                    accept=".csv,.pdf"
                    onChange={(e) => handleFileChange("bankFile", e.target.files?.[0] || null)}
                    className="hidden"
                    id="bank-upload"
                  />
                  <label
                    htmlFor="bank-upload"
                    className="px-4 py-2 text-sm font-semibold text-tertiary hover:text-tertiary/80 cursor-pointer font-['Inter']"
                  >
                    {formData.bankFile ? formData.bankFile.name : "CONNECT BANK"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Data Enrichment Panel */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground font-['Manrope']">DATA ENRICHMENT</h3>
                <Sparkles className="w-4 h-4 text-outline-variant" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-error-container rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-error" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-['Manrope']">Credit Bureau</p>
                      <p className="text-xs text-muted-foreground font-['Inter']">EQUIFAX / EXPERIAN</p>
                    </div>
                  </div>
                  <RefreshCw className="w-4 h-4 text-outline-variant cursor-pointer hover:text-tertiary" />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-['Manrope']">Legal Check</p>
                      <p className="text-xs text-muted-foreground font-['Inter']">JUDICIAL RECORDS HUB</p>
                    </div>
                  </div>
                  <RefreshCw className="w-4 h-4 text-outline-variant cursor-pointer hover:text-tertiary" />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-['Manrope']">Social Sentinel</p>
                      <p className="text-xs text-muted-foreground font-['Inter']">SENTIMENT ANALYSIS</p>
                    </div>
                  </div>
                  <RefreshCw className="w-4 h-4 text-outline-variant cursor-pointer hover:text-tertiary" />
                </div>
              </div>
            </div>

            {/* External Signals */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
              <h3 className="font-bold text-foreground mb-4 font-['Manrope']">EXTERNAL SIGNALS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-low rounded-xl text-center">
                  <p className="text-2xl font-bold text-foreground font-['Manrope']">742</p>
                  <p className="text-xs text-muted-foreground uppercase font-['Inter']">Bureau Score</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl text-center">
                  <p className="text-2xl font-bold text-tertiary font-['Manrope']">Clean</p>
                  <p className="text-xs text-muted-foreground uppercase font-['Inter']">Lien Status</p>
                </div>
              </div>
            </div>

            {/* Finalize Application */}
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h3 className="font-bold mb-2 font-['Manrope']">Finalize Application</h3>
              <p className="text-sm text-primary-foreground/80 mb-4 font-['Inter']">
                Execute full algorithmic risk profiling based on 142 integrated data points.
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-foreground/80 font-['Inter']">Application Integrity</span>
                  <span className="text-sm font-semibold text-tertiary-foreground">{applicationIntegrity}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full transition-all"
                    style={{ width: `${applicationIntegrity}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleStartAnalysis}
                className="w-full py-3 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 font-['Inter']"
              >
                <Sparkles className="w-4 h-4" />
                Start Analysis
              </button>

              <button className="w-full py-3 mt-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors font-['Inter']">
                Save as Draft
              </button>

              <p className="text-xs text-primary-foreground/60 text-center mt-4 font-['Inter']">
                Analysis typically completes in &lt; 60 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}