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

        {/* Create Room Card */}
        <div className="glass-card p-6 mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            Start a New Game
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Create a room and invite a friend with the code.
          </p>
          <button
            id="create-room-btn"
            onClick={createRoom}
            disabled={!isConnected || isLoading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white text-sm
                       bg-gradient-to-r from-purple-600 to-fuchsia-600
                       hover:from-purple-500 hover:to-fuchsia-500
                       active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200
                       shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                Creating...
              </span>
            ) : (
              "Create Room"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
            or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Join Room Card */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            Join a Room
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter the 6-character code shared by your friend.
          </p>
          <form onSubmit={handleJoinSubmit} className="flex gap-3">
            <input
              id="room-code-input"
              type="text"
              value={joinCode}
              onChange={handleCodeChange}
              placeholder="ABX72K"
              maxLength={6}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-mono text-center text-white
                         tracking-[0.3em] uppercase placeholder-gray-600
                         bg-white/5 border border-white/10
                         focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30
                         transition-all duration-200"
            />
            <button
              id="join-room-btn"
              type="submit"
              disabled={!isConnected || isLoading || joinCode.length !== 6}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm
                         bg-emerald-600 hover:bg-emerald-500
                         active:scale-[0.98]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200
                         shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Join
            </button>
          </form>
        </div>
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
