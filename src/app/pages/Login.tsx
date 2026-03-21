import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, User, Sparkles, Shield, Zap } from "lucide-react";
import { supabase } from "../../supabase";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // New toggle state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
  });
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Explicit Sign Up Logic
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.username,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (signUpData.session) {
          localStorage.setItem("intelli-credit-auth", JSON.stringify({
            isLoggedIn: true,
            username: formData.username,
            fullName: formData.fullName || signUpData.session.user?.user_metadata?.full_name || "",
            loginTime: new Date().toISOString(),
            token: signUpData.session.access_token
          }));
          navigate("/dashboard");
        } else {
          setError("Account created! Please check your email for a confirmation link.");
          setIsSignUp(false); // switch to login mode after successful signup step
        }
      } else {
        // Explicit Sign In Logic
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.username,
          password: formData.password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        if (signInData.session) {
          localStorage.setItem("intelli-credit-auth", JSON.stringify({
            isLoggedIn: true,
            username: formData.username,
            fullName: signInData.session.user?.user_metadata?.full_name || "",
            loginTime: new Date().toISOString(),
            token: signInData.session.access_token
          }));
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.username) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.username, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (resetError) throw resetError;
      setSuccess("Password reset link sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gradient Background Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#00b386]/8 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#1e40af]/8 rounded-full blur-[150px]"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#50ddad]/5 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Login Card — Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl shadow-[0_24px_48px_rgba(6,14,32,0.5)] border border-white/[0.06] p-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#50ddad] to-[#00b386] rounded-2xl mb-4 shadow-[0_0_30px_rgba(80,221,173,0.25)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#50ddad] to-[#00b386] bg-clip-text text-transparent mb-2">
              Intelli-Credit AI
            </h1>
            <p className="text-[#86948c] text-sm">
              {isSignUp ? "Create a New Officer Account" : "AI-Powered Credit Risk Analysis Platform"}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Only for Sign Up) */}
            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.1 }}>
                <label className="block text-xs font-medium text-[#86948c] uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3c4a43] group-focus-within:text-[#50ddad] transition-colors" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-[#060e20] border border-[#1e293b] rounded-xl focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 outline-none transition-all text-[#dae2fd] placeholder-[#3c4a43] text-sm"
                    placeholder="E.g. Rajesh Kumar"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            {/* Username/Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-medium text-[#86948c] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3c4a43] group-focus-within:text-[#50ddad] transition-colors" />
                <input
                  type="email"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#060e20] border border-[#1e293b] rounded-xl focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 outline-none transition-all text-[#dae2fd] placeholder-[#3c4a43] text-sm"
                  placeholder="officer.id@intellicredit.ai"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-xs font-medium text-[#86948c] uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3c4a43] group-focus-within:text-[#50ddad] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-[#060e20] border border-[#1e293b] rounded-xl focus:ring-2 focus:ring-[#50ddad]/30 focus:border-[#50ddad]/40 outline-none transition-all text-[#dae2fd] placeholder-[#3c4a43] text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3c4a43] hover:text-[#50ddad] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl"
              >
                <p className="text-sm text-[#10b981] text-center">{success}</p>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl"
              >
                <p className="text-sm text-[#ef4444] text-center">{error}</p>
              </motion.div>
            )}

            {/* Remember & Forgot / Switch Mode */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                {!isSignUp && (
                  <>
                    <input type="checkbox" className="w-4 h-4 rounded border-[#1e293b] bg-[#060e20] text-[#50ddad] focus:ring-[#50ddad]/30" />
                    <span className="ml-2 text-[#86948c]">Remember me</span>
                  </>
                )}
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#50ddad] hover:text-[#71fac8] font-medium transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Forgot password?
                </button>
              )}
            </motion.div>

            {/* Sign In / Sign Up Button */}
            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#50ddad] to-[#00b386] text-[#003828] rounded-xl font-semibold shadow-[0_8px_32px_rgba(0,179,134,0.3)] hover:shadow-[0_12px_40px_rgba(0,179,134,0.4)] transition-all disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          {/* Registration Toggle Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e293b]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#131b2e]/80 text-[#3c4a43] uppercase tracking-widest">
                {isSignUp ? "Already Registered?" : "New to Intelli-Credit?"}
              </span>
            </div>
          </div>

          <div className="flex justify-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-[#86948c] hover:text-[#dae2fd] transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-[#50ddad] font-semibold">Sign In here</span></>
              ) : (
                <>Don't have an officer ID? <span className="text-[#50ddad] font-semibold">Sign Up here</span></>
              )}
            </button>
          </div>

          {/* Trust Indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 flex items-center justify-center gap-6 text-[10px] text-[#3c4a43] uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#50ddad]" /> Secure</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#50ddad]" /> Enterprise</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#50ddad]" /> AI-Powered</span>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-6">
          <p className="text-xs text-[#3c4a43]">
            © 2026 Intelli-Credit AI • Sovereign Financial Intelligence
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
