import React from "react";
import { Bot, Sparkles, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import AIChat from "../components/AIChat";

function AIAssistant() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>LifeSync Copilot AI</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
              Active RAG Inference
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Natural-language queries synthesized across your financial ledger, document vault, vitals, and tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Tenant Isolated Context</span>
        </div>
      </div>

      {/* Feature capabilities banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shrink-0">
            <Zap className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Financial Queries</h4>
            <p className="text-[11px] text-slate-500">"What did I spend on groceries?"</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shrink-0">
            <Bot className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Document Insights</h4>
            <p className="text-[11px] text-slate-500">"What documents expire soon?"</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shrink-0">
            <Sparkles className="h-4 w-4 text-rose-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Health Summaries</h4>
            <p className="text-[11px] text-slate-500">"Summarize my recent blood pressure"</p>
          </div>
        </div>
      </div>

      {/* Embedded Chat */}
      <AIChat />
    </div>
  );
}

export default AIAssistant;
