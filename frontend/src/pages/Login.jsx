import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateEmail } from "../utils/validators";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please provide both email and password.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast("Welcome back! Authentication successful.", "success");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Check your credentials.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginDemo();
      showToast("Signed in as Demo User (Alex Vance)!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      showToast("Demo sign-in failed. Please verify the backend is running.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">LifeSync AI</span>
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-900">Sign in to your Vault</h2>
            <p className="mt-2 text-sm text-slate-600">
              Access your encrypted documents, financial ledger, and AI Copilot.
            </p>
          </div>

          {/* 1-Click Demo Login Banner for Viva Defense */}
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200/60 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                  <Zap className="h-3 w-3" /> Quick Evaluation
                </span>
                <p className="mt-1 text-xs text-emerald-900 font-medium">
                  Pre-configured demo account with documents, transactions, & tasks.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition disabled:opacity-50"
            >
              <span>Instant 1-Click Demo Login</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-slate-900 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit TLS Encrypted & Tenant Isolated</span>
          </div>
        </div>
      </div>

      {/* Decorative Brand Graphic Side */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Autonomous Personal Operating System</span>
          </div>

          <div className="max-w-md space-y-4">
            <blockquote className="text-2xl font-bold leading-snug">
              "Your complete digital life orchestrated: finances, documents, health vitals, and tasks synthesized through intelligent Copilot AI."
            </blockquote>
            <p className="text-xs text-slate-400">
              LifeSync AI Engineering Platform • Master College Capstone Defense Ready
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            BUILD 2026.09.25 // SECURE MULTI-TENANT ARCHITECTURE
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
