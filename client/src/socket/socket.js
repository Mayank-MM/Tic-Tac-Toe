// ============================================
// Socket.IO Client Instance
// Centralized socket connection to the backend
// ============================================

import { io } from "socket.io-client";

// Read backend URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Singleton Socket.IO client instance.
 * - autoConnect: false → we control when to connect (useful for future auth flows)
 * - reconnection: true → auto-reconnect on disconnect
 */
const socket = io(API_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default socket;
