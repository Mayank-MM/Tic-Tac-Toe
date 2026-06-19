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
        startTurnTimer(io, room);
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

    if (room.status === "finished") {
      return socket.emit("invalid-move", {
        reason: "Game Finished",
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

    // Apply valid move
    room.board[index] = player.symbol;

    // Clear active turn timer
    if (room.turnInterval) {
      clearInterval(room.turnInterval);
      room.turnInterval = null;
    }

    // Check for a winner
    const winResult = checkWinner(room.board);
    if (winResult) {
      room.status = "finished";
      room.winner = winResult.winner;

      // Broadcast game-over to everyone in the room
      io.to(code).emit("game-over", {
        winner: winResult.winner,
        winningCells: winResult.winningCells,
      });

      // Still broadcast the final board-updated state so clients render the last move
      io.to(code).emit("board-updated", {
        board: room.board,
        currentTurn: room.currentTurn,
        gameStatus: room.status,
        winner: room.winner,
      });

      console.log(`🏆 Game Over in room ${code}: ${winResult.winner} wins!`);
      return;
    }

    // Check for a draw
    const isDraw = checkDraw(room.board);
    if (isDraw) {
      room.status = "finished";
      room.winner = null;

      // Broadcast game-over to everyone in the room
      io.to(code).emit("game-over", {
        winner: null,
        draw: true,
      });

      // Broadcast the final board-updated state
      io.to(code).emit("board-updated", {
        board: room.board,
        currentTurn: room.currentTurn,
        gameStatus: room.status,
        winner: null,
      });

      console.log(`🤝 Game Over in room ${code}: It's a Draw!`);
      return;
    }

    // Toggle turn if game is not finished
    room.currentTurn = room.currentTurn === "X" ? "O" : "X";

    // Broadcast board updates to all room players
    io.to(code).emit("board-updated", {
      board: room.board,
      currentTurn: room.currentTurn,
      gameStatus: room.status,
      winner: null,
    });

    // Start turn timer for next player
    startTurnTimer(io, room);
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

    // Cancel turn interval if it was running
    if (room.turnInterval) {
      clearInterval(room.turnInterval);
      room.turnInterval = null;
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

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6]  // Diagonal 2
];

/**
 * Checks if a player has won the game on the given board.
 * @param {Array<string>} board - The 3x3 board array
 * @returns {{winner: string, winningCells: Array<number>}|null} The winner and the winning combination, or null
 */
const checkWinner = (board) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningCells: combination
      };
    }
  }
  return null;
};

/**
 * Checks if the board state is a draw.
 * @param {Array<string>} board - The 3x3 board array
 * @returns {boolean} True if draw
 */
const checkDraw = (board) => {
  return board.every((cell) => cell !== "");
};

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

/**
 * Starts/Resets the turn timer for the active room.
 * @param {import("socket.io").Server} io - Socket.IO server instance
 * @param {object} room - The room object
 */
const startTurnTimer = (io, room) => {
  if (room.turnInterval) {
    clearInterval(room.turnInterval);
  }

  room.turnTimeLeft = 10;

  io.to(room.roomCode).emit("turn-time-updated", {
    timeLeft: room.turnTimeLeft,
    currentTurn: room.currentTurn,
  });

  room.turnInterval = setInterval(() => {
    room.turnTimeLeft--;
    if (room.turnTimeLeft <= 0) {
      clearInterval(room.turnInterval);
      room.turnInterval = null;
      handleTurnTimeout(io, room);
    } else {
      io.to(room.roomCode).emit("turn-time-updated", {
        timeLeft: room.turnTimeLeft,
        currentTurn: room.currentTurn,
      });
    }
  }, 1000);
};

/**
 * Handles a turn timeout by passing the turn to the other player.
 * @param {import("socket.io").Server} io - Socket.IO server instance
 * @param {object} room - The room object
 */
const handleTurnTimeout = (io, room) => {
  const code = room.roomCode;
  const timeoutSymbol = room.currentTurn;

  // Toggle turn without making any moves on the board
  room.currentTurn = room.currentTurn === "X" ? "O" : "X";

  console.log(`⏱️ Turn Timeout in room ${code}: ${timeoutSymbol} timed out. Turn passed to ${room.currentTurn}`);

  io.to(code).emit("board-updated", {
    board: room.board,
    currentTurn: room.currentTurn,
    gameStatus: room.status,
    winner: null,
  });

  startTurnTimer(io, room);
};

export { rooms };
export default registerRoomHandlers;
