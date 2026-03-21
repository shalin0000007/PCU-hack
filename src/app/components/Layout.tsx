import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "New Application", path: "/new-application" },
  { icon: History, label: "History", path: "/history" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`flex min-h-screen bg-surface ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-900 flex flex-col py-6 px-4 z-50 font-body antialiased tracking-tight">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-500 font-headline">
              Intelli-Credit
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              AI Risk Engine
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">RK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                Rahul Kumar
              </p>
              <p className="text-xs text-slate-400 truncate">Credit Analyst</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications, companies..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="bg-surface min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  );
}
