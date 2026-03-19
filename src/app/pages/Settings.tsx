import Layout from "../components/Layout";
import { User, Bell, Lock, Globe, Palette, Database } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl text-[#1a1a1a] dark:text-white">Settings</h1>
          <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-[#00b386]" />
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#1a1a1a] dark:text-white">Full Name</label>
                <input
                  type="text"
                  defaultValue="Rajesh Kumar"
                  className="mt-1 w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] text-[#1a1a1a] dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-[#1a1a1a] dark:text-white">Email</label>
                <input
                  type="email"
                  defaultValue="rajesh.kumar@bank.com"
                  className="mt-1 w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] text-[#1a1a1a] dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-[#1a1a1a] dark:text-white">Role</label>
                <input
                  type="text"
                  defaultValue="Credit Officer"
                  disabled
                  className="mt-1 w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl text-[#737373] dark:text-[#94a3b8]"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-[#00b386]" />
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#1a1a1a] dark:text-white">High Risk Alerts</p>
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Get notified for high-risk cases</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#00b386] rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#1a1a1a] dark:text-white">Analysis Complete</p>
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8]">When analysis finishes</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#00b386] rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#1a1a1a] dark:text-white">Weekly Reports</p>
                  <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Summary of activities</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-[#00b386] rounded" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#00b386]" />
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Security</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] text-[#1a1a1a] dark:text-white rounded-xl hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 transition-all text-sm text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] text-[#1a1a1a] dark:text-white rounded-xl hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 transition-all text-sm text-left">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] text-[#1a1a1a] dark:text-white rounded-xl hover:bg-[#e5f7f3] dark:hover:bg-[#0f766e]/20 transition-all text-sm text-left">
                View Login History
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-[#00b386]" />
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#1a1a1a] dark:text-white">Theme</label>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mb-2">
                  Toggle dark mode from the top bar
                </p>
                <select className="w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl text-[#1a1a1a] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]">
                  <option>System Default</option>
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#1a1a1a] dark:text-white">Language</label>
                <select className="mt-1 w-full px-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-[#e5e5e5] dark:border-[#475569] rounded-xl text-[#1a1a1a] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00b386]">
                  <option>English (US)</option>
                  <option>हिन्दी (Hindi)</option>
                  <option>मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-[20px] shadow-lg border border-[#e5e5e5] dark:border-[#334155] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg text-[#1a1a1a] dark:text-white">Save Changes</h3>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8] mt-1">
                Don't forget to save your preferences
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-[#00b386] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all">
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
