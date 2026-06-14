// ============================================
// Socket.IO Event Handlers
// Manages real-time WebSocket connections
// ============================================

import registerRoomHandlers from "./roomHandlers.js";

/**
 * Initializes Socket.IO event listeners on the given server instance.
 * Registers per-connection handlers for rooms (and future: game events).
 *
 * @param {import("socket.io").Server} io - The Socket.IO server instance
 */
const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    // Register room management events for this socket
    registerRoomHandlers(io, socket);

    // --- Disconnect Handler (logging only, room cleanup is in roomHandlers) ---
    socket.on("disconnect", (reason) => {
      console.log(`❌ User Disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });
};

export default initializeSocket;
