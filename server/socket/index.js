// ============================================
// Socket.IO Event Handlers
// Manages real-time WebSocket connections
// ============================================

/**
 * Initializes Socket.IO event listeners on the given server instance.
 * Currently handles: connection, disconnect.
 * Future phases will add room and game events here.
 *
 * @param {import("socket.io").Server} io - The Socket.IO server instance
 */
const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    // --- Disconnect Handler ---
    socket.on("disconnect", (reason) => {
      console.log(`❌ User Disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });
};

export default initializeSocket;
