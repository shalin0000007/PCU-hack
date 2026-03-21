import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, TrendingUp, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@intellicredit.ai");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline">Intelli-Credit</h1>
              <p className="text-emerald-100 text-sm">AI Risk Engine</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight font-headline">
            Smarter Credit Decisions,<br />Powered by AI
          </h2>

          <p className="text-lg text-emerald-100 mb-10 max-w-md">
            Transform your credit risk assessment with advanced machine learning. Analyze GST returns, bank statements, and market data in seconds.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: "Multi-source data verification" },
              { icon: Sparkles, text: "AI-powered risk scoring" },
              { icon: TrendingUp, text: "Real-time market analysis" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-emerald-50">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface font-headline">Intelli-Credit</h1>
              <p className="text-sm text-muted-foreground">AI Risk Engine</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-8 border border-outline-variant/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-on-surface font-headline">Welcome Back</h2>
              <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30"
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading || authLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-outline-variant/20">
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Use Demo Credentials
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Click to auto-fill demo account credentials
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
