import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Save,
  Moon,
  Sun,
  Globe,
  Mail,
} from "lucide-react";
import Layout from "../components/Layout";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <Layout>
      <div className="p-6 bg-surface min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-on-surface font-headline">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
                  <h2 className="text-lg font-semibold text-on-surface mb-6 font-headline">
                    Profile Information
                  </h2>

                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-white text-2xl font-bold">
                      RK
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        Change Photo
                      </button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">First Name</label>
                      <input
                        type="text"
                        defaultValue="Rahul"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Kumar"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Email</label>
                      <input
                        type="email"
                        defaultValue="rahul.kumar@intellicredit.ai"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Role</label>
                      <input
                        type="text"
                        defaultValue="Credit Analyst"
                        disabled
                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
                  <h2 className="text-lg font-semibold text-on-surface mb-6 font-headline">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {[
                      { label: "Email Notifications", desc: "Receive email updates for important alerts", icon: Mail },
                      { label: "High Risk Alerts", desc: "Get notified when high-risk applications are detected", icon: Bell },
                      { label: "Weekly Reports", desc: "Receive weekly summary of all applications", icon: Database },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-on-surface">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
                  <h2 className="text-lg font-semibold text-on-surface mb-6 font-headline">
                    Appearance Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDarkMode}
                          onChange={() => {
                            setIsDarkMode(!isDarkMode);
                            document.documentElement.classList.toggle("dark");
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">Language</p>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                      </div>
                      <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
                  <h2 className="text-lg font-semibold text-on-surface mb-6 font-headline">
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                      <Shield className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
                  <h2 className="text-lg font-semibold text-on-surface mb-6 font-headline">
                    API Configuration
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Supabase URL</label>
                      <input
                        type="text"
                        placeholder="https://your-project.supabase.co"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Supabase Anon Key</label>
                      <input
                        type="password"
                        placeholder="Enter your Supabase anon key"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">OpenAI API Key</label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                      <Save className="w-4 h-4" />
                      Save API Keys
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
