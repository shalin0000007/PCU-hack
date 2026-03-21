import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { supabase } from "../../supabase";
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
  LogOut,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Rajesh Kumar");

  useEffect(() => {
    const auth = localStorage.getItem("intelli-credit-auth");
    if (!auth) {
      navigate("/");
      return;
    }
    try {
      const authParsed = JSON.parse(auth);
      // Determine display name gracefully pulling from Auth or parsing email prefix
      if (authParsed.fullName) {
         setUserName(authParsed.fullName);
      } else if (authParsed.username) {
         // Convert officer.id@... -> Officer Id
         const prefix = authParsed.username.split("@")[0];
         const formatted = prefix.split(/[._-]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
         setUserName(formatted);
      }
    } catch (e) {}

    const settings = localStorage.getItem("intelli-credit-settings");
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.fullName) setUserName(parsed.fullName);
      } catch (e) {}
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("intelli-credit-auth");
    navigate("/");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b1326] transition-colors duration-300">
        {/* Sidebar — Sovereign Intelligence */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#131b2e] border-r border-[#e5e5e5] dark:border-[#1e293b]/50 transition-colors duration-300 z-30">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#50ddad] to-[#00b386] rounded-xl flex items-center justify-center shadow-lg shadow-[#00b386]/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#dae2fd]">Intelli-Credit</h2>
                <p className="text-xs text-[#737373] dark:text-[#86948c] uppercase tracking-wider">AI Platform</p>
              </div>
            </div>
          </div>

          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#50ddad]/20 to-[#00b386]/10 text-[#50ddad] border border-[#50ddad]/20 shadow-lg shadow-[#00b386]/10"
                      : "text-[#737373] dark:text-[#86948c] hover:bg-[#f5f5f5] dark:hover:bg-[#1e293b] hover:text-[#1a1a1a] dark:hover:text-[#bbcac1]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-[#50ddad]" : ""}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#50ddad] shadow-[0_0_6px_#50ddad]" />}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-3 right-3 space-y-3">
            <div className="bg-gradient-to-br from-[#e5f7f3] to-[#d1fae5] dark:from-[#00b386]/10 dark:to-[#059669]/5 p-4 rounded-xl border border-transparent dark:border-[#00b386]/15">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#00b386] dark:text-[#50ddad]" />
                <p className="text-xs font-semibold text-[#1a1a1a] dark:text-[#50ddad]">AI Assistant</p>
              </div>
              <p className="text-[10px] text-[#737373] dark:text-[#86948c]">24/7 Available • Context-Aware</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ef4444] hover:bg-[#fee2e2] dark:hover:bg-[#ef4444]/10 transition-all text-sm cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">
          {/* Top Bar — Glassmorphism */}
          <header className="sticky top-0 h-16 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl border-b border-[#e5e5e5] dark:border-[#1e293b]/30 z-20 transition-colors duration-300">
            <div className="h-full px-6 flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373] dark:text-[#86948c]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search applications, entities, or datasets..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f5] dark:bg-[#060e20] border border-transparent dark:border-[#1e293b] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50ddad]/40 text-sm text-[#1a1a1a] dark:text-[#dae2fd] placeholder:text-[#737373] dark:placeholder:text-[#86948c] transition-all"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] dark:hover:bg-[#1e293b] rounded-xl transition-colors cursor-pointer">
                  <Bell className="w-5 h-5 text-[#737373] dark:text-[#86948c]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full shadow-[0_0_6px_#ef4444]" />
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] dark:hover:bg-[#1e293b] rounded-xl transition-colors cursor-pointer"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-[#f59e0b]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#737373]" />
                  )}
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#f5f5f5] dark:hover:bg-[#1e293b] rounded-xl transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#50ddad] to-[#00b386] rounded-lg flex items-center justify-center shadow-md shadow-[#00b386]/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#dae2fd]">{userName}</p>
                    <p className="text-xs text-[#737373] dark:text-[#86948c]">Credit Officer</p>
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
