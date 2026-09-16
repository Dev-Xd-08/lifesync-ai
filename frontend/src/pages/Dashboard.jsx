import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AIChat from "../components/AIChat";

function Dashboard() {
  const [serverStatus, setServerStatus] = useState("Checking connection...");
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalExpenses: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    // 1. Check server health
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => setServerStatus(data.message))
      .catch(() => setServerStatus("Backend is disconnected."));

    // 2. Fetch real dashboard stats
    fetch("http://localhost:5000/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="mt-1 text-slate-600">
            Welcome back! Here is a summary of your digital life.
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {serverStatus}
          </div>
        </header>
        
        {/* Dynamic Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-medium text-slate-500">Total Documents</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalDocuments}</p>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-medium text-slate-500">Total Expenses</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">${stats.totalExpenses.toFixed(2)}</p>
          </div>
          
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-medium text-slate-500">Pending Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.pendingTasks}</p>
          </div>
        </div>

        <AIChat />
      </main>
    </div>
  );
}

export default Dashboard;