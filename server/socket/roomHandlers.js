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
      countdownInterval: null, // Track countdown interval for cleanup
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

    // Broadcast room update to BOTH players
    io.to(code).emit("room-updated", {
      roomCode: code,
      playerCount: room.players.length,
      status: room.status,
    });

    // Notify that room is ready and start countdown
    io.to(code).emit("room-ready");

    // Start 3-second countdown
    let count = 3;
    io.to(code).emit("start-countdown", count);

    room.countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        io.to(code).emit("start-countdown", count);
      } else {
        // Countdown finished
        clearInterval(room.countdownInterval);
        room.countdownInterval = null;
        room.status = "playing";
        room.board = Array(9).fill("");
        room.currentTurn = "X";

        // Randomly assign symbol "X" and "O" to the two players
        const hostPlayer = room.players[0];
        const guestPlayer = room.players[1];
        if (hostPlayer && guestPlayer) {
          const isHostX = Math.random() > 0.5;
          hostPlayer.symbol = isHostX ? "X" : "O";
          guestPlayer.symbol = isHostX ? "O" : "X";

          // Notify each player individually with their assigned symbol
          io.to(hostPlayer.socketId).emit("start-game", { playerSymbol: hostPlayer.symbol });
          io.to(guestPlayer.socketId).emit("start-game", { playerSymbol: guestPlayer.symbol });
        } else {
          // Fallback if players list is not fully populated
          io.to(code).emit("start-game");
        }
        console.log(`🚀 Game started in room: ${code}`);
      }
    }, 1000);
  });

  // ─── MAKE MOVE ──────────────────────────────────────
  socket.on("make-move", ({ roomCode, cellIndex }) => {
    const code = roomCode?.toString().trim().toUpperCase();
    const room = rooms.get(code);

    // Rule 3: Valid room and active status
    if (!room) {
      return socket.emit("invalid-move", {
        reason: "Room not found.",
      });
    }

    if (room.status !== "playing") {
      return socket.emit("invalid-move", {
        reason: "Game is not currently active.",
      });
    }

    // Verify player socket is registered in the room
    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player) {
      return socket.emit("invalid-move", {
        reason: "You are not a player in this room.",
      });
    }

    // Rule 2: Only current player can move
    if (player.symbol !== room.currentTurn) {
      return socket.emit("invalid-move", {
        reason: "Not your turn.",
      });
    }

    // Rule 4: Cell index range check
    const index = parseInt(cellIndex, 10);
    if (isNaN(index) || index < 0 || index > 8) {
      return socket.emit("invalid-move", {
        reason: "Invalid board cell index.",
      });
    }

    // Rule 1: Cell must be empty
    if (room.board[index] !== "") {
      return socket.emit("invalid-move", {
        reason: "Cell already occupied.",
      });
    }

    // Apply valid move and toggle turn
    room.board[index] = player.symbol;
    room.currentTurn = room.currentTurn === "X" ? "O" : "X";

    // Broadcast board updates to all room players
    io.to(code).emit("board-updated", {
      board: room.board,
      currentTurn: room.currentTurn,
    });
  });


  // ─── DISCONNECT ─────────────────────────────────────
  socket.on("disconnect", () => {
    const room = findRoomBySocketId(socket.id);
    if (!room) return;

    console.log(`🚪 Player ${socket.id} left room: ${room.roomCode}`);

    // Remove the player from the room
    room.players = room.players.filter((p) => p.socketId !== socket.id);

    // Cancel countdown if it was running
    if (room.countdownInterval) {
      clearInterval(room.countdownInterval);
      room.countdownInterval = null;
    }

    if (room.players.length === 0) {
      // No players left → delete the room
      rooms.delete(room.roomCode);
      console.log(`🗑️  Room ${room.roomCode} deleted (empty)`);
    } else {
      // Notify remaining player
      room.status = "waiting";
      
      // Emit player-left specifically for explicit disconnect UI
      io.to(room.roomCode).emit("player-left", {
        playerCount: room.players.length,
        status: room.status,
      });

      // Also emit general room-updated
      io.to(room.roomCode).emit("room-updated", {
        roomCode: room.roomCode,
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
