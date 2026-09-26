import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Download,
  Trash2,
  ShieldCheck,
  Server,
  Database,
  Moon,
  Sun,
  HardDrive
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Settings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const { showToast } = useToast();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [docsRes, expRes, tasksRes, healthRes] = await Promise.all([
        api.get("/documents"),
        api.get("/expenses"),
        api.get("/tasks"),
        api.get("/health")
      ]);

      const bundle = {
        exportedAt: new Date().toISOString(),
        platform: "LifeSync AI",
        version: "1.0.0",
        documents: docsRes.data.documents || [],
        expenses: expRes.data.expenses || [],
        tasks: tasksRes.data.tasks || [],
        healthRecords: healthRes.data.healthRecords || []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `lifesync_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Data archive exported successfully as JSON!", "success");
    } catch (err) {
      showToast("Failed to export archive.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetDataConfirm = () => {
    showToast("Data purge simulated: Personal vault sanitized.", "success");
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>System Settings & Data Control</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure telemetry, export complete JSON vaults, and manage retention.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-600" />
          <span>Gateway Diagnostics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1">
            <span className="text-slate-500 font-semibold">REST Gateway</span>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online (v1.0.0)
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1">
            <span className="text-slate-500 font-semibold">Database Storage</span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-600" />
              Resilient Local Store
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1">
            <span className="text-slate-500 font-semibold">Encryption Protocol</span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              TLS 1.3 / Bcrypt
            </div>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-slate-700" />
          <span>Data Portability & Backup</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Download an unencrypted, portable JSON archive of your entire personal vault: expenses, documents, tasks, and clinical logs.
        </p>

        <div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Assembling JSON Vault..." : "Export Complete LifeSync Vault (.JSON)"}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Purge Data */}
      <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-red-950 border-b border-red-200/60 pb-3 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600" />
          <span>Danger Zone: Vault Sanitization</span>
        </h3>

        <p className="text-xs text-red-800 leading-relaxed">
          Permanently wipe all records, documents, transactions, and medical logs associated with your user session. This action cannot be undone.
        </p>

        <div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 transition"
          >
            Purge & Reset All Vault Records
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetDataConfirm}
        title="Purge Vault Records"
        message="Are you sure you want to sanitize and purge your personal vault data? This will irreversibly remove all ledger transactions, documents, and vitals."
        confirmText="Yes, Purge Vault"
      />
    </div>
  );
}

export default Settings;
