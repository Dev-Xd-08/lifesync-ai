/**
 * Format numerical amounts to standard currency strings
 */
export function formatCurrency(amount = 0, currency = "USD") {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(num);
}

/**
 * Format ISO dates to human-readable strings
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  });
}

/**
 * Convert byte counts to human readable strings (e.g. 2.4 MB)
 */
export function formatFileSize(bytes = 0) {
  const b = Number(bytes) || 0;
  if (b === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${parseFloat((b / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Mask sensitive identity documents to XXXX-XXXX-1234
 */
export function formatMaskedId(rawId = "") {
  if (!rawId) return "N/A";
  const clean = String(rawId).replace(/[^a-zA-Z0-9]/g, "");
  if (clean.length < 4) return rawId;
  return `XXXX-XXXX-${clean.slice(-4).toUpperCase()}`;
}
