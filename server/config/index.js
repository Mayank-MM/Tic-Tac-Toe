// ============================================
// Server Configuration
// Centralizes all environment variable access
// ============================================

import dotenv from "dotenv";
dotenv.config();

const config = {
  // Server port — defaults to 3001
  port: parseInt(process.env.PORT, 10) || 3001,

  // Allowed client origin for CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default config;
