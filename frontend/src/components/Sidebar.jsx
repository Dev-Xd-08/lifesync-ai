import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderLock,
  Receipt,
  HeartPulse,
  CheckSquare,
  Sparkles,
  LogOut,
  Bell,
  Bot,
  User,
  Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar({ onNavClick }) {
  const { user, logout } = useAuth();

  const coreNavItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Documents Vault", path: "/documents", icon: FolderLock },
    { name: "Expenses & Budget", path: "/expenses", icon: Receipt },
    { name: "Tasks & Deadlines", path: "/tasks", icon: CheckSquare },
    { name: "Health Records", path: "/health", icon: HeartPulse },
    { name: "Reminders & Alerts", path: "/reminders", icon: Bell },
    { name: "AI Assistant", path: "/ai", icon: Bot }
  ];

  const systemNavItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings & Backup", path: "/settings", icon: Settings }
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
            LifeSync AI
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Vault
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
        <div>
          <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          <div className="mt-1 space-y-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            System & Account
          </div>
          <div className="mt-1 space-y-1">
            {systemNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Session Footer */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        {user && (
          <div className="mb-3 flex items-center gap-3 px-2">
            <img
              src={
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user.name || "User"
                )}`
              }
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-200 bg-white object-cover shadow-2xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;