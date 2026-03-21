import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  Building2,
  FileSpreadsheet,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";

export default function NewApplication() {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  
  const [companyName, setCompanyName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [term, setTerm] = useState("12");
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !loanAmount) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("company_name", companyName);
      formData.append("loan_amount", loanAmount);
      formData.append("purpose", purpose);
      formData.append("term_months", term);
      
      if (gstFile) formData.append("gst_file", gstFile);
      if (bankFile) formData.append("bank_file", bankFile);

      const headers = getAuthHeaders();
      // Remove Content-Type for FormData
      delete (headers as any)["Content-Type"];

      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadCard = ({
    title,
    description,
    icon: Icon,
    file,
    onFileChange,
    accept,
  }: {
    title: string;
    description: string;
    icon: any;
    file: File | null;
    onFileChange: (file: File | null) => void;
    accept: string;
  }) => (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-primary hover:bg-primary/5 ${
        file ? "border-emerald-500 bg-emerald-50" : "border-outline-variant"
      }`}
      onClick={() => document.getElementById(`file-${title}`)?.click()}
    >
      <input
        id={`file-${title}`}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
      <div
        className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
          file ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
        }`}
      >
        {file ? <CheckCircle className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
      </div>
      <h4 className="font-semibold text-on-surface mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      {file ? (
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">{file.name}</span>
        </div>
      ) : (
        <span className="text-xs text-primary font-medium">Click to upload or drag & drop</span>
      )}
    </div>
  );

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-2xl p-10 text-center shadow-lg border border-outline-variant/20 max-w-md">
            <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-3 font-headline">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your application is being processed. AI analysis will begin shortly.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-surface p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-on-surface font-headline">
                New Credit Application
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Submit a new application for AI-powered risk assessment
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <h3 className="text-lg font-semibold text-on-surface mb-5 flex items-center gap-2 font-headline">
                <Building2 className="w-5 h-5 text-primary" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Loan Purpose
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="">Select purpose</option>
                    <option value="working_capital">Working Capital</option>
                    <option value="expansion">Business Expansion</option>
                    <option value="equipment">Equipment Purchase</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <h3 className="text-lg font-semibold text-on-surface mb-5 flex items-center gap-2 font-headline">
                <DollarSign className="w-5 h-5 text-primary" />
                Loan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Loan Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="10,00,000"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Loan Term (Months)
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <h3 className="text-lg font-semibold text-on-surface mb-5 flex items-center gap-2 font-headline">
                <Upload className="w-5 h-5 text-primary" />
                Document Upload
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FileUploadCard
                  title="GST Returns"
                  description="Upload GST filing documents (CSV, PDF)"
                  icon={FileSpreadsheet}
                  file={gstFile}
                  onFileChange={setGstFile}
                  accept=".csv,.pdf,.xlsx"
                />
                <FileUploadCard
                  title="Bank Statement"
                  description="Upload bank statements (CSV, PDF)"
                  icon={FileSpreadsheet}
                  file={bankFile}
                  onFileChange={setBankFile}
                  accept=".csv,.pdf,.xlsx"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Supported formats: CSV, PDF, XLSX. Max file size: 10MB each.
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-outline-variant text-on-surface rounded-xl font-medium hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Submit for Analysis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
