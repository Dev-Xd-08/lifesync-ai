import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            LifeSync AI
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-900 transition">
            Features
          </a>
          <a href="#architecture" className="hover:text-slate-900 transition">
            Architecture
          </a>
          <a href="#security" className="hover:text-slate-900 transition">
            Security & Compliance
          </a>
        </div>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;