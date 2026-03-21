import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Database, FileSpreadsheet, Building2, Sparkles } from "lucide-react";
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

  const handleStartAnalysis = async () => {
    if (!formData.companyName || !formData.loanAmount) {
      alert("Please enter at least the company name and loan amount.");
      return;
    }

    setIsSubmitting(true);
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
        navigate(`/analysis-process/${result.application_id}`);
      } else {
        alert("Failed to start analysis: " + (result.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("Failed to connect to the backend server. Please make sure the FastAPI server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-surface min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-xl transition-colors border border-outline-variant/30"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-headline">New Loan Application</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter company details and upload financial data for AI analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">Company Information</h3>
                  <p className="text-sm text-muted-foreground">Basic details about the applicant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter company name"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Industry</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Construction">Construction</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Loan Amount (₹) *</label>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">External Company Name</label>
                  <input
                    type="text"
                    value={formData.externalCompany}
                    onChange={(e) => setFormData({ ...formData, externalCompany: e.target.value })}
                    placeholder="For news search"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-on-surface">Purpose of Loan</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Describe the purpose of this loan application"
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">Financial Documents</h3>
                  <p className="text-sm text-muted-foreground">Upload GST and bank statements for analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">GST Returns (CSV)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-surface-container-low transition-all">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {formData.gstFile ? formData.gstFile.name : "Click to upload GST file"}
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileChange("gstFile", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* Bank Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Bank Statements (CSV)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-surface-container-low transition-all">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {formData.bankFile ? formData.bankFile.name : "Click to upload bank file"}
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileChange("bankFile", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <h3 className="font-semibold text-on-surface mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleUseSampleData}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-on-surface transition-colors"
                >
                  <Database className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Use Sample Data</span>
                </button>
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">AI Analysis</h3>
              </div>
              <p className="text-emerald-100 text-sm mb-4">
                Our AI will analyze financial patterns, detect anomalies, and generate comprehensive risk reports.
              </p>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                  GST & Bank reconciliation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                  Real-time news sentiment
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                  Risk score calculation
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleStartAnalysis}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {isSubmitting ? "Starting Analysis..." : "Start AI Analysis"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
