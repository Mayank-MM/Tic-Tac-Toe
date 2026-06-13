// ============================================
// Main Server Entry Point
// Express + Socket.IO bootstrapping
// ============================================

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import config from "./config/index.js";
import initializeSocket from "./socket/index.js";
import { log } from "./utils/logger.js";

// --- Express Setup ---
const app = express();
const httpServer = createServer(app);

// --- Middleware ---
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

// --- Health Check Route ---
app.get("/", (_req, res) => {
  res.json({ status: "Server Running" });
});

// --- Socket.IO Setup ---
const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

// Initialize socket event handlers
initializeSocket(io);

// --- Start Server ---
httpServer.listen(config.port, () => {
  log("SERVER", `🚀 Express server running on http://localhost:${config.port}`);
  log("SERVER", `🔌 Socket.IO server ready`);
  log("SERVER", `🌐 CORS allowed origin: ${config.clientUrl}`);
});
