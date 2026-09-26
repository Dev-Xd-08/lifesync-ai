import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  Sparkles,
  Shield,
  User,
  Search,
  Bell,
  HardDrive
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import GlobalSearchModal from "../components/common/GlobalSearchModal";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">Loading LifeSync Vault...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-100">
          <span className="text-base font-bold text-slate-900">LifeSync AI</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Input Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:bg-white hover:text-slate-600 transition shadow-2xs w-48 sm:w-64 text-left"
            >
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Search LifeSync...</span>
              <kbd className="hidden sm:inline-block ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              REST Gateway Online
            </div>

            {/* Notification Bell linking to /reminders */}
            <Link
              to="/reminders"
              className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
              title="Event Reminders & Alerts"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                2
              </span>
            </Link>

            {/* Profile Avatar link */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-2xs hover:bg-slate-50 transition"
            >
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.name || "User"
                  )}`
                }
                alt={user?.name}
                className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-100 object-cover"
              />
              <span className="hidden sm:inline-block text-xs font-bold text-slate-900 truncate max-w-[100px]">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default AppLayout;
