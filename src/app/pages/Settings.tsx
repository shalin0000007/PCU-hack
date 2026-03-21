import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { User, Bell, Lock, Palette, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount prioritizing Auth
  useEffect(() => {
    let initialName = "";
    let initialEmail = "";

    const auth = localStorage.getItem("intelli-credit-auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.fullName) initialName = parsed.fullName;
        if (parsed.username) initialEmail = parsed.username;
        if (!initialName && initialEmail) {
          const prefix = initialEmail.split("@")[0];
          initialName = prefix.split(/[._-]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        }
      } catch (e) {}
    }

    const settings = localStorage.getItem("intelli-credit-settings");
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.highRiskAlerts !== undefined) setHighRiskAlerts(parsed.highRiskAlerts);
        if (parsed.analysisComplete !== undefined) setAnalysisComplete(parsed.analysisComplete);
        if (parsed.weeklyReports !== undefined) setWeeklyReports(parsed.weeklyReports);
        // Auth overwrites settings name if auth exists, otherwise fallback
        if (!initialName && parsed.fullName) initialName = parsed.fullName;
        if (!initialEmail && parsed.email) initialEmail = parsed.email;
      } catch (e) {}
    }

    setFullName(initialName || "Guest Officer");
    setEmail(initialEmail || "guest@intellicredit.ai");
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      "intelli-credit-settings",
      JSON.stringify({ fullName, email, highRiskAlerts, analysisComplete, weeklyReports })
    );
    // Also update auth if they change their name
    const auth = localStorage.getItem("intelli-credit-auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        parsed.fullName = fullName;
        localStorage.setItem("intelli-credit-auth", JSON.stringify(parsed));
      } catch (e) {}
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    window.dispatchEvent(new Event("storage")); // trigger Layout update if needed
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#737373] dark:from-[#dae2fd] dark:to-[#86948c]">Officer Settings</h1>
          <p className="text-sm text-[#737373] dark:text-[#86948c] mt-1">
            Manage your sovereign platform preferences and account security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e5e5e5] dark:border-white/[0.06]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#00b386]/20 dark:to-[#059669]/10 rounded-xl flex items-center justify-center border border-transparent dark:border-[#00b386]/20">
                 <User className="w-5 h-5 text-[#00b386] dark:text-[#50ddad]" />
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Profile Information</h3>
                 <p className="text-xs text-[#737373] dark:text-[#86948c]">Active session identity</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 transition-all text-[#1a1a1a] dark:text-[#dae2fd] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Email (Supabase Identity)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="mt-2 w-full px-4 py-3 bg-[#e5e5e5] dark:bg-[#060e20]/50 border border-[#d4d4d8] dark:border-[#1e293b]/50 rounded-xl focus:outline-none text-[#737373] dark:text-[#86948c] text-sm opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Global Role</label>
                <div className="mt-2 flex items-center gap-2 px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl text-sm">
                   <Sparkles className="w-4 h-4 text-[#50ddad]" />
                   <span className="text-[#1a1a1a] dark:text-[#50ddad] font-medium">Senior Credit Officer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e5e5e5] dark:border-white/[0.06]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#3b82f6]/20 dark:to-[#2563eb]/10 rounded-xl flex items-center justify-center border border-transparent dark:border-[#3b82f6]/20">
                 <Bell className="w-5 h-5 text-[#00b386] dark:text-[#60a5fa]" />
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Notifications</h3>
                 <p className="text-xs text-[#737373] dark:text-[#86948c]">Manage system alerts</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">High Risk Alerts</p>
                  <p className="text-xs text-[#737373] dark:text-[#86948c] mt-0.5">Push notifications for severe anomalies</p>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskAlerts}
                  onChange={(e) => setHighRiskAlerts(e.target.checked)}
                  className="w-5 h-5 text-[#50ddad] rounded bg-[#060e20] border-[#1e293b] focus:ring-[#50ddad]/30 accent-[#50ddad] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">Analysis Complete</p>
                  <p className="text-xs text-[#737373] dark:text-[#86948c] mt-0.5">Alerts when AI engines wrap up</p>
                </div>
                <input
                  type="checkbox"
                  checked={analysisComplete}
                  onChange={(e) => setAnalysisComplete(e.target.checked)}
                  className="w-5 h-5 text-[#50ddad] rounded bg-[#060e20] border-[#1e293b] focus:ring-[#50ddad]/30 accent-[#50ddad] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">Weekly Digest</p>
                  <p className="text-xs text-[#737373] dark:text-[#86948c] mt-0.5">Automated portfolio summary emails</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyReports}
                  onChange={(e) => setWeeklyReports(e.target.checked)}
                  className="w-5 h-5 text-[#50ddad] rounded bg-[#060e20] border-[#1e293b] focus:ring-[#50ddad]/30 accent-[#50ddad] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e5e5e5] dark:border-white/[0.06]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#ef4444]/20 dark:to-[#dc2626]/10 rounded-xl flex items-center justify-center border border-transparent dark:border-[#ef4444]/20">
                 <Lock className="w-5 h-5 text-[#ef4444] dark:text-[#f87171]" />
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Security & Access</h3>
                 <p className="text-xs text-[#737373] dark:text-[#86948c]">Active session control</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#060e20] text-[#1a1a1a] dark:text-[#dae2fd] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl hover:bg-[#e5f7f3] dark:hover:border-[#50ddad]/50 transition-all text-sm font-medium text-left">
                Trigger Password Reset Email
              </button>
              <button className="w-full px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#060e20] text-[#1a1a1a] dark:text-[#dae2fd] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl hover:bg-[#e5f7f3] dark:hover:border-[#50ddad]/50 transition-all text-sm font-medium text-left">
                Enable Hardware Two-Factor (2FA)
              </button>
              <button className="w-full px-5 py-3.5 bg-[#f5f5f5] text-[#ef4444] dark:bg-[#ef4444]/10 border border-[#e5e5e5] dark:border-[#ef4444]/30 rounded-xl hover:bg-[#fee2e2] dark:hover:bg-[#ef4444]/20 transition-all text-sm font-bold text-left">
                Terminate All Other Sessions
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-white/[0.04] backdrop-blur-2xl rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e5e5e5] dark:border-white/[0.06]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#fef3c7] to-[#fde68a] dark:from-[#f59e0b]/20 dark:to-[#d97706]/10 rounded-xl flex items-center justify-center border border-transparent dark:border-[#f59e0b]/20">
                 <Palette className="w-5 h-5 text-[#f59e0b] dark:text-[#fbbf24]" />
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">User Interface</h3>
                 <p className="text-xs text-[#737373] dark:text-[#86948c]">Platform styling</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-[#86948c] uppercase tracking-wider">Engine Theme</label>
                <p className="text-xs text-[#737373] dark:text-[#86948c] mb-2 mt-1">
                  You can seamlessly toggle this from the top navigation bar.
                </p>
                <select className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#060e20] border border-[#e5e5e5] dark:border-[#1e293b] rounded-xl text-[#1a1a1a] dark:text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#50ddad]/30">
                  <option>Sovereign Dark Mode (Default)</option>
                  <option>System Sync</option>
                  <option>Light Mode</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0b1326] rounded-[20px] shadow-[0_0_40px_rgba(80,221,173,0.1)] border border-[#e5e5e5] dark:border-[#50ddad]/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#dae2fd]">Confirm Configuration</h3>
            <p className="text-sm text-[#737373] dark:text-[#86948c] mt-1">
              Save your Sovereign Intelligence platform preferences.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
              saved
                ? "bg-[#10b981] text-white shadow-[#10b981]/20 cursor-not-allowed"
                : "bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] hover:shadow-[0_8px_30px_rgba(0,179,134,0.3)] hover:scale-[1.02]"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5 border-2 border-white rounded-full p-0.5" />
                Preferences Cached
              </>
            ) : (
              "Save Active Changes"
            )}
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
