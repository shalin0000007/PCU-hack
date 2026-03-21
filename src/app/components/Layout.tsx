import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FileOutput,
  Settings,
  Search,
  Bell,
  HelpCircle,
  CreditCard,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Applications", path: "/history" },
    { icon: BarChart3, label: "Risk Analysis", path: "/analysis" },
    { icon: FileOutput, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/analysis") {
      return location.pathname.includes("/credit-analysis") || location.pathname.includes("/analysis-process");
    }
    if (path === "/reports") {
      return location.pathname.includes("/report");
    }
    if (path === "/history") {
      return location.pathname === "/history" || location.pathname === "/new-application";
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 gap-y-2 z-50">
        {/* Logo */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tighter font-['Manrope']">Intelli-Credit</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Portfolio Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "text-slate-900 dark:text-white font-semibold bg-white dark:bg-slate-800 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/80"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-['Manrope'] font-medium text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center">
              <span className="text-tertiary-foreground font-bold text-xs">GF</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Global FinCorp</p>
              <p className="text-[10px] text-muted-foreground">Enterprise Tier</p>
            </div>
          </div>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-8 shadow-[0_12px_32px_rgba(42,52,57,0.06)]">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              <input
                type="text"
                placeholder="Search portfolio entities..."
                className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-surface-container rounded-full transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-surface-container rounded-full transition-all">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-outline-variant/20" />
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Alex Rivera</p>
                <p className="text-[10px] text-muted-foreground">Lead Analyst</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary ring-2 ring-transparent group-hover:ring-primary/20 transition-all flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-24 px-8 pb-12 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
