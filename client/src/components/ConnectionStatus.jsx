// ============================================
// Component: ConnectionStatus
// Displays real-time Socket.IO connection state
// ============================================

import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";

/**
 * Visual indicator for socket connection status.
 * Shows a pulsing green dot when connected, red when disconnected.
 * Auto-hides after 3 seconds of stable connection.
 */
const ConnectionStatus = () => {
  const { isConnected, socketId } = useSocket();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout;
    if (isConnected) {
      // Auto-hide after 3 seconds of being connected
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } else {
      // Always show immediately if disconnected
      setIsVisible(true);
    }

    return () => clearTimeout(timeout);
  }, [isConnected]);

  if (!isVisible) return null;

  return (
    <div className="glass-card px-5 py-4 inline-flex flex-col gap-2 animate-fade-in-up transition-opacity duration-500">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        {/* Pulsing indicator dot */}
        <span className="relative flex h-3 w-3">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isConnected
                ? "bg-emerald-400 animate-ping"
                : "bg-red-400 animate-ping"
            }`}
            style={{ animationDuration: "1.5s" }}
          />
          <span
            className={`relative inline-flex h-3 w-3 rounded-full ${
              isConnected ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
        </span>

        {/* Status text */}
        <span
          className={`text-sm font-semibold tracking-wide ${
            isConnected ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Socket ID (shown only when connected) */}
      {isConnected && socketId && (
        <p className="text-xs text-gray-500 font-mono pl-6 truncate max-w-[200px]">
          ID: {socketId}
        </p>
      )}
    </div>
  );
};

export default ConnectionStatus;
