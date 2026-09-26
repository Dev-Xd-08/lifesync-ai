import React from "react";
import { FolderOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "Get started by adding your first record.",
  actionText,
  onAction,
  className = ""
}) {
  return (
    <div className={`p-12 text-center rounded-2xl border border-slate-200/80 bg-white ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
