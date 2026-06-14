// ============================================
// Page: Home
// Landing page — Create or Join a room
// ============================================

import { useState } from "react";
import ConnectionStatus from "../components/ConnectionStatus";
import { useRoom } from "../contexts/RoomContext";
import useSocket from "../hooks/useSocket";

/**
 * Home page: Displays game title, connection status,
 * and room creation / joining controls.
 */
const Home = () => {
  const [joinCode, setJoinCode] = useState("");
  const { createRoom, joinRoom, error, isLoading, clearError } = useRoom();
  const { isConnected } = useSocket();

  // Handle join form submission
  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (joinCode.trim().length === 0) return;
    joinRoom(joinCode);
  };

  // Format room code input — uppercase, max 6 chars
  const handleCodeChange = (e) => {
    clearError();
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setJoinCode(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      {/* Hero Section */}
      <div className="text-center max-w-lg animate-fade-in-up">
        {/* Game Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20">
          <span className="text-4xl" role="img" aria-label="game icon">
            ❌⭕
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Multiplayer
          </span>
          <br />
          <span className="text-white">Tic-Tac-Toe</span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-gray-400 text-lg font-light leading-relaxed">
          Real-time multiplayer battles. <br className="hidden sm:block" />
          Challenge your friends — anytime, anywhere.
        </p>
      </div>

      {/* Action Cards */}
      <div
        className="mt-10 w-full max-w-md animate-fade-in-up"
        style={{ animationDelay: "0.15s" }}
      >
        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* ── Primary CTA: Create Room ──────────────── */}
        <button
          id="create-room-btn"
          onClick={createRoom}
          disabled={!isConnected || isLoading}
          className="group w-full py-5 px-6 rounded-2xl font-bold text-white text-lg
                     bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600
                     bg-[length:200%_100%] hover:bg-right
                     active:scale-[0.97]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-300 ease-out
                     shadow-[0_4px_24px_rgba(124,92,252,0.3)] hover:shadow-[0_6px_32px_rgba(124,92,252,0.5)]
                     border border-purple-400/20 hover:border-purple-400/40
                     flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating Room...
            </span>
          ) : (
            <>
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">🎮</span>
              <span>Create Room</span>
              <span className="text-purple-300/60 text-sm font-normal ml-1">— Start a match</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-semibold">
            or join a friend
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ── Secondary CTA: Join Room ─────────────── */}
        <form
          onSubmit={handleJoinSubmit}
          className="glass-card p-5 space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🔗</span>
            <span className="text-sm font-semibold text-white">
              Join by Room Code
            </span>
          </div>
          <div className="flex gap-3">
            <input
              id="room-code-input"
              type="text"
              value={joinCode}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="flex-1 px-4 py-3.5 rounded-xl text-sm font-mono text-center text-white
                         tracking-[0.25em] uppercase placeholder-gray-500
                         bg-white/[0.03] border border-white/10
                         focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06]
                         focus:ring-2 focus:ring-emerald-500/20
                         transition-all duration-200 min-w-0"
            />
            <button
              id="join-room-btn"
              type="submit"
              disabled={!isConnected || isLoading || joinCode.length !== 6}
              className="px-7 py-3.5 rounded-xl font-bold text-white text-sm
                         bg-emerald-600 hover:bg-emerald-500
                         active:scale-[0.97]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200
                         shadow-[0_4px_16px_rgba(52,211,153,0.2)] hover:shadow-[0_4px_24px_rgba(52,211,153,0.35)]
                         border border-emerald-400/20 hover:border-emerald-400/40"
            >
              Join →
            </button>
          </div>
        </form>
      </div>

      {/* Connection Status */}
      <div
        className="mt-8 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <ConnectionStatus />
      </div>
    </div>
  );
};

export default Home;
