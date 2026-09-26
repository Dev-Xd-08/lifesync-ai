import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  FolderLock,
  Receipt,
  HeartPulse,
  CheckSquare,
  ArrowRight,
  Loader2
} from "lucide-react";
import api from "../../services/api";

export function GlobalSearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose ? null : null;
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = searchTerm.toLowerCase();
        const [docsRes, expRes, tasksRes, healthRes] = await Promise.all([
          api.get("/documents"),
          api.get("/expenses"),
          api.get("/tasks"),
          api.get("/health")
        ]);

        const matches = [];

        // Match Documents
        if (docsRes.data.success) {
          docsRes.data.documents.forEach((d) => {
            if (
              d.title.toLowerCase().includes(query) ||
              d.category.toLowerCase().includes(query) ||
              d.extractedMetadata?.issuer?.toLowerCase().includes(query)
            ) {
              matches.push({
                type: "Document",
                title: d.title,
                subtitle: `${d.category} • Issuer: ${d.extractedMetadata?.issuer || "Private"}`,
                path: "/documents",
                icon: FolderLock
              });
            }
          });
        }

        // Match Expenses
        if (expRes.data.success) {
          expRes.data.expenses.forEach((e) => {
            if (
              e.description.toLowerCase().includes(query) ||
              e.category.toLowerCase().includes(query)
            ) {
              matches.push({
                type: "Expense",
                title: `${e.description} (${e.type === "income" ? "+" : "-"}$${Number(e.amount).toFixed(2)})`,
                subtitle: `${e.category} • ${new Date(e.date).toLocaleDateString()}`,
                path: "/expenses",
                icon: Receipt
              });
            }
          });
        }

        // Match Tasks
        if (tasksRes.data.success) {
          tasksRes.data.tasks.forEach((t) => {
            if (
              t.title.toLowerCase().includes(query) ||
              t.category.toLowerCase().includes(query) ||
              t.description?.toLowerCase().includes(query)
            ) {
              matches.push({
                type: "Task",
                title: t.title,
                subtitle: `Priority: ${t.priority.toUpperCase()} • Status: ${t.status}`,
                path: "/tasks",
                icon: CheckSquare
              });
            }
          });
        }

        // Match Health Records
        if (healthRes.data.success) {
          healthRes.data.healthRecords.forEach((h) => {
            if (
              h.title.toLowerCase().includes(query) ||
              h.recordType.toLowerCase().includes(query) ||
              h.notes?.toLowerCase().includes(query)
            ) {
              matches.push({
                type: "Health",
                title: h.title,
                subtitle: `${h.recordType} • ${new Date(h.recordDate).toLocaleDateString()}`,
                path: "/health",
                icon: HeartPulse
              });
            }
          });
        }

        setResults(matches);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search LifeSync... (e.g. tax, insurance, groceries, dental)"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono text-slate-400">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching vault across all collections...</span>
            </div>
          ) : !searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to search across documents, expenses, health logs, and tasks.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{searchTerm}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-slate-50 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Global LifeSync Index</span>
          <span>{results.length} matches</span>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;
