import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FileOutput,
  History,
  Settings,
  Search,
  Bell,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "New Application", path: "/new-application" },
    { icon: BarChart3, label: "Analysis", path: "/analysis" },
    { icon: FileOutput, label: "Reports", path: "/reports" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/analysis") {
      return location.pathname.includes("/credit-analysis") || location.pathname.includes("/analysis-process");
    }
    if (path === "/reports") {
      return location.pathname.includes("/report");
    }
    return location.pathname === path;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f172a] transition-colors duration-300">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#1e293b] border-r border-[#e5e5e5] dark:border-[#334155] transition-colors duration-300 z-30">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00b386] to-[#059669] rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg text-[#1a1a1a] dark:text-white">Intelli-Credit</h2>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8]">AI Platform</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#00b386] to-[#059669] text-white shadow-lg"
                      : "text-[#737373] dark:text-[#94a3b8] hover:bg-[#f5f5f5] dark:hover:bg-[#334155]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#0f766e] dark:to-[#065f46] p-4 rounded-xl">
              <p className="text-xs text-[#1a1a1a] dark:text-white mb-1">AI Assistant</p>
              <p className="text-[10px] text-[#737373] dark:text-[#94a3b8]">24/7 Available</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">
          {/* Top Bar */}
          <header className="sticky top-0 h-16 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-[#e5e5e5] dark:border-[#334155] z-20 transition-colors duration-300">
            <div className="h-full px-6 flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Search applications, companies..."
                    className="w-full pl-10 pr-4 py-2 bg-[#f5f5f5] dark:bg-[#334155] border border-transparent dark:border-[#475569] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b386] text-sm text-[#1a1a1a] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#94a3b8] transition-all"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] dark:hover:bg-[#334155] rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full"></span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] dark:hover:bg-[#334155] rounded-xl transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-[#f59e0b]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#737373]" />
                  )}
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#f5f5f5] dark:hover:bg-[#334155] rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00b386] to-[#059669] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[#1a1a1a] dark:text-white">Rajesh Kumar</p>
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8]">Credit Officer</p>
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
