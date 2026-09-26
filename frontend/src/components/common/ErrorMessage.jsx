import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorMessage({
  title = "Something went wrong",
  message = "An error occurred while loading this section.",
  onRetry,
  className = ""
}) {
  return (
    <div
      className={`rounded-2xl border border-red-200/80 bg-red-50/70 p-6 text-center ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-2xs">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-red-950">{title}</h3>
      <p className="mt-1 text-xs text-red-800/80 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-900 px-4 py-2 text-xs font-bold text-white hover:bg-red-800 transition shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
