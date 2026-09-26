import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  size = "default",
  label = "Loading...",
  fullPage = false,
  className = ""
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-slate-900`} />
      {label && <p className="text-xs font-semibold tracking-wide text-slate-600">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center w-full">{content}</div>;
}

export default LoadingSpinner;
