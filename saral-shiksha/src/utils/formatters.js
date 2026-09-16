// src/utils/formatters.js
// Shared formatting utilities.

/**
 * Convert a decimal progress value (0-100) to a human-readable percentage string.
 * @param {number} value - 0 to 100
 * @returns {string} e.g. "70%"
 */
export function formatProgress(value) {
  return `${Math.min(100, Math.max(0, Math.round(value)))}%`;
}

/**
 * Return a Tailwind colour class based on a score / progress value.
 * Used for progress bars, badges, etc.
 * @param {number} value - 0 to 100
 * @returns {string} Tailwind bg-* class
 */
export function progressColour(value) {
  if (value >= 75) return "bg-green-500";
  if (value >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

/**
 * Truncate a string to a max length, appending "…" if needed.
 * @param {string} str
 * @param {number} [max=80]
 * @returns {string}
 */
export function truncate(str, max = 80) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}
