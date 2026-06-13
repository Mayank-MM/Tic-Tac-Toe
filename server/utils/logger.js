// ============================================
// Utility: Logger
// Simple structured logger for consistent output
// ============================================

/**
 * Logs a formatted message with a label prefix.
 * @param {string} label - Category label (e.g., "SERVER", "SOCKET")
 * @param {string} message - The message to log
 */
export const log = (label, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${label}] ${message}`);
};
