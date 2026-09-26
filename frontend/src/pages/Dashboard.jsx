import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderLock,
  Receipt,
  CheckSquare,
  HeartPulse,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import api from "../services/api";
import AIChat from "../components/AIChat";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalExpenses: 0,
    totalIncome: 0,
    netSavings: 0,
    pendingTasks: 0,
    urgentTasks: 0,
    healthRecords: 0,
    categoryBreakdown: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/stats");
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
      setError("Unable to aggregate LifeSync metrics. Please ensure the server gateway is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Aggregating LifeSync vault metrics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is the live synthesized status of your digital life and records.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <FolderLock className="h-3.5 w-3.5 text-slate-900" />
            <span>Upload Doc</span>
          </Link>
          <Link
            to="/expenses"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Receipt className="h-3.5 w-3.5 text-slate-900" />
            <span>Add Expense</span>
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
            <span>New Task</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Spent
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              ${stats.totalExpenses.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`font-semibold ${stats.netSavings >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                {stats.netSavings >= 0 ? `+$${stats.netSavings.toFixed(2)}` : `-$${Math.abs(stats.netSavings).toFixed(2)}`}
              </span>
              <span>net savings</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Tasks
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.pendingTasks}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {stats.urgentTasks > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  {stats.urgentTasks} urgent deadlines
                </span>
              ) : (
                <span className="text-slate-500">All deadlines on schedule</span>
              )}
            </div>
          </div>
        </div>

        {/* Document Vault */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Documents Vault
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800">
              <FolderLock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.totalDocuments}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>OCR Indexed & Encrypted</span>
            </div>
          </div>
        </div>

        {/* Health Records */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Health Vitals
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.healthRecords}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Clinical markers monitored
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition sm:col-span-2 lg:col-span-4 xl:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reminders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {stats.pendingTasks + 2}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Deadlines & expirations tracked
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Category Spending Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Expense Allocation</h3>
            <Link to="/expenses" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5">
              <span>View Ledger</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              stats.categoryBreakdown.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-900">
                      ${cat.total.toFixed(2)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-500"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4">No expense records yet.</p>
            )}
          </div>
        </div>

        {/* Live Recent Activity Feed */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Unified Activity Stream</h3>
            <span className="text-xs font-medium text-slate-400">Real-time sync</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((act, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 shrink-0">
                      {act.type === "document" && <FolderLock className="h-4 w-4" />}
                      {act.type === "expense" && <Receipt className="h-4 w-4" />}
                      {act.type === "task" && <CheckSquare className="h-4 w-4" />}
                      {act.type === "health" && <HeartPulse className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{act.title}</p>
                      <p className="text-[11px] text-slate-500">{act.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {new Date(act.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4">No recent activity recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights & Copilot Section */}
      <div className="space-y-4">
        {/* AI Insights Card */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/60 p-5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Autonomous LifeSync Insights</span>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <span className="font-semibold text-slate-500">Cashflow Position</span>
              <p className="mt-1 font-bold text-slate-900">
                {stats.netSavings >= 0 ? `Net surplus of +$${stats.netSavings.toFixed(2)}` : "Operating in deficit"}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <span className="font-semibold text-slate-500">Upcoming Deadlines</span>
              <p className="mt-1 font-bold text-slate-900">
                {stats.urgentTasks > 0 ? `${stats.urgentTasks} urgent commitments pending` : "All commitments on schedule"}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <span className="font-semibold text-slate-500">Vault Health</span>
              <p className="mt-1 font-bold text-slate-900">
                {stats.totalDocuments} documents secured & OCR indexed
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Contextual AI Assistant */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              LifeSync Intelligence Copilot
            </h2>
          </div>
          <AIChat />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;