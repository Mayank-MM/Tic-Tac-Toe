// ============================================
// Socket.IO Room Event Handlers
// Manages room creation, joining, and cleanup
// ============================================

import generateRoomCode from "../utils/generateRoomCode.js";

// In-memory room storage
const rooms = new Map();

/**
 * Registers room-related socket events for a connected client.
 *
 * Events handled:
 *  - create-room   → Creates a new room, assigns player as X
 *  - join-room     → Joins an existing room, assigns player as O
 *  - disconnect    → Cleans up rooms when a player leaves
 *
 * @param {import("socket.io").Server} io - Socket.IO server instance
 * @param {import("socket.io").Socket} socket - The connected socket
 */
const registerRoomHandlers = (io, socket) => {
  // ─── CREATE ROOM ────────────────────────────────────
  socket.on("create-room", (callback) => {
    // Check if player is already in a room
    const existingRoom = findRoomBySocketId(socket.id);
    if (existingRoom) {
      return callback?.({
        error: "already-in-room",
        message: "You are already in a room.",
      });
    }

    const roomCode = generateRoomCode(rooms);

    const room = {
      roomCode,
      players: [
        {
          socketId: socket.id,
          symbol: "X",
        },
      ],
      status: "waiting", // waiting | ready | playing | finished
      createdAt: Date.now(),
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);

    console.log(`🏠 Room created: ${roomCode} by ${socket.id}`);

    callback?.({
      success: true,
      roomCode,
      playerSymbol: "X",
    });
  });

  // ─── JOIN ROOM ──────────────────────────────────────
  socket.on("join-room", (roomCode, callback) => {
    // Normalize room code to uppercase
    const code = roomCode?.toString().trim().toUpperCase();

    // Validate room exists
    const room = rooms.get(code);
    if (!room) {
      return callback?.({
        error: "room-not-found",
        message: "Room not found. Check the code and try again.",
      });
    }

    // Prevent duplicate joins
    const alreadyInRoom = room.players.some((p) => p.socketId === socket.id);
    if (alreadyInRoom) {
      return callback?.({
        error: "already-in-room",
        message: "You are already in this room.",
      });
    }

    // Validate room is not full
    if (room.players.length >= 2) {
      return callback?.({
        error: "room-full",
        message: "This room is already full.",
      });
    }

    // Add player to room
    room.players.push({
      socketId: socket.id,
      symbol: "O",
    });

    room.status = "ready";
    socket.join(code);

    console.log(`🤝 Player ${socket.id} joined room: ${code}`);

    // Respond to the joining player
    callback?.({
      success: true,
      roomCode: code,
      playerSymbol: "O",
    });

    // Notify the host that an opponent has joined
    socket.to(code).emit("player-joined", {
      playerCount: room.players.length,
      status: room.status,
    });
  });

  // ─── DISCONNECT ─────────────────────────────────────
  socket.on("disconnect", () => {
    const room = findRoomBySocketId(socket.id);
    if (!room) return;

    console.log(`🚪 Player ${socket.id} left room: ${room.roomCode}`);

    // Remove the player from the room
    room.players = room.players.filter((p) => p.socketId !== socket.id);

    if (room.players.length === 0) {
      // No players left → delete the room
      rooms.delete(room.roomCode);
      console.log(`🗑️  Room ${room.roomCode} deleted (empty)`);
    } else {
      // Notify remaining player
      room.status = "waiting";
      io.to(room.roomCode).emit("player-left", {
        playerCount: room.players.length,
        status: room.status,
      });
    }
  });
};

// ─── HELPERS ────────────────────────────────────────────

/**
 * Finds a room that contains a player with the given socket ID.
 * @param {string} socketId
 * @returns {object|null} The room object, or null
 */
const findRoomBySocketId = (socketId) => {
  for (const [, room] of rooms) {
    if (room.players.some((p) => p.socketId === socketId)) {
      return room;
    }
  }
  return null;
};

export { rooms };
export default registerRoomHandlers;
