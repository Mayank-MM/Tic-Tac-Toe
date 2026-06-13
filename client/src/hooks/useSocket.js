// ============================================
// Custom Hook: useSocket
// Manages socket connection state reactively
// ============================================

import { useState, useEffect } from "react";
import socket from "../socket/socket";

/**
 * Hook that tracks the Socket.IO connection status.
 * Returns { isConnected, socketId } — updates reactively on connect/disconnect.
 */
const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(socket.id || null);

  useEffect(() => {
    // Handler: successful connection
    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
      console.log("🔌 Socket connected:", socket.id);
    };

    // Handler: disconnection
    const onDisconnect = (reason) => {
      setIsConnected(false);
      setSocketId(null);
      console.log("🔌 Socket disconnected:", reason);
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // If already connected when hook mounts, sync state
    if (socket.connected) {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { isConnected, socketId };
};

export default useSocket;
