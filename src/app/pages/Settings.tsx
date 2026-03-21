import Layout from "../components/Layout";
import { User, Bell, Lock, Palette, Shield, Key, Globe } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-['Manrope']">Settings</h1>
          <p className="text-muted-foreground mt-1 font-['Inter']">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-tertiary-container rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-['Manrope']">Profile Settings</h3>
                <p className="text-sm text-muted-foreground font-['Inter']">Update your personal information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex Rivera"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex.rivera@globalfincorp.com"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue="Senior Analyst"
                  disabled
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-xl text-muted-foreground cursor-not-allowed font-['Inter']"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-['Manrope']">Notifications</h3>
                <p className="text-sm text-muted-foreground font-['Inter']">Configure your alert preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">High Risk Alerts</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">Get notified for critical cases</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">Analysis Complete</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">When analysis finishes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">Summary of activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-error-container rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-error" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-['Manrope']">Security</h3>
                <p className="text-sm text-muted-foreground font-['Inter']">Manage your account security</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors text-left">
                <Key className="w-5 h-5 text-outline-variant" />
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">Change Password</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">Update your account password</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors text-left">
                <Lock className="w-5 h-5 text-outline-variant" />
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">Add an extra layer of security</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors text-left">
                <Globe className="w-5 h-5 text-outline-variant" />
                <div>
                  <p className="font-semibold text-foreground font-['Manrope']">Active Sessions</p>
                  <p className="text-sm text-muted-foreground font-['Inter']">Manage your login sessions</p>
                </div>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-['Manrope']">Appearance</h3>
                <p className="text-sm text-muted-foreground font-['Inter']">Customize your experience</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Theme
                </label>
                <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']">
                  <option>System Default</option>
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Language
                </label>
                <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-outline-variant uppercase tracking-wider font-['Inter']">
                  Date Format
                </label>
                <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-['Inter']">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground font-['Manrope']">Save Changes</h3>
              <p className="text-sm text-muted-foreground font-['Inter']">Don't forget to save your preferences</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-foreground rounded-xl font-semibold transition-colors font-['Inter']">
                Cancel
              </button>
              <button className="px-5 py-2.5 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground rounded-xl font-semibold transition-colors font-['Inter']">
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
