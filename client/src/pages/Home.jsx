// ============================================
// Page: Home
// Landing page — Create or Join a room
// ============================================

import { useState } from "react";
import ConnectionStatus from "../components/ConnectionStatus";
import { useRoom } from "../contexts/RoomContext";
import useSocket from "../hooks/useSocket";
import RouteTransition from "../animations/RouteTransition";
import StickyNote from "../components/StickyNote";

/**
 * Home page: Displays game title, connection status,
 * and room creation / joining controls using the notebook/sticky note aesthetic.
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
    <RouteTransition>
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4 relative z-10 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-lg mb-8">
          {/* Game Icon */}
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-amber-500/15 border border-yellow-500/15 shadow-sm">
            <span className="text-4xl animate-pulse" role="img" aria-label="game icon">
              ✏️
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none text-white">
            <span className="font-handwritten text-yellow-400 block rotate-[-3deg] text-6xl mb-2 text-shadow-sm">
              Multiplayer
            </span>
            <span className="text-4xl sm:text-5xl font-bold tracking-wide">Tic-Tac-Toe</span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-gray-400 text-base font-light leading-relaxed">
            Real-time multiplayer battles. <br className="hidden sm:block" />
            Play with your friends on a virtual notebook grid.
          </p>
        </div>

        {/* Action Cards */}
        <div className="w-full space-y-6">
          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-handwritten text-lg animate-bounce">
              ⚠️ {error}
            </div>
          )}

          {/* Create Room Sticky Note (Yellow) */}
          <StickyNote color="yellow" rotation="rotate-[-1.5deg]" className="p-6">
            <h3 className="text-2xl font-handwritten font-bold mb-3 flex items-center gap-2 text-gray-800">
              <span>📝</span> Create a Match
            </h3>
            <p className="text-xs text-gray-600 mb-5 font-sans leading-relaxed">
              Start a new game session. You will get a unique room code to share with a friend.
            </p>
            <button
              id="create-room-btn"
              onClick={createRoom}
              disabled={!isConnected || isLoading}
              className="group w-full py-3 px-5 rounded-xl font-bold text-white text-sm
                         bg-gray-800 hover:bg-gray-900 active:scale-[0.98]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Room...
                </span>
              ) : (
                <>
                  <span className="text-lg">🎮</span>
                  <span>Create Room</span>
                </>
              )}
            </button>
          </StickyNote>

          {/* Join Room Sticky Note (Blue) */}
          <StickyNote color="blue" rotation="rotate-[1deg]" className="p-6">
            <form onSubmit={handleJoinSubmit} className="space-y-3">
              <h3 className="text-2xl font-handwritten font-bold mb-2 flex items-center gap-2 text-gray-800">
                <span>🔗</span> Join by Room Code
              </h3>
              <p className="text-xs text-gray-600 mb-4 font-sans leading-relaxed">
                Enter your friend's 6-character room code to connect and start playing.
              </p>
              <div className="flex gap-2">
                <input
                  id="room-code-input"
                  type="text"
                  value={joinCode}
                  onChange={handleCodeChange}
                  placeholder="ABX72K"
                  maxLength={6}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm font-mono text-center text-gray-800
                             tracking-[0.2em] uppercase placeholder-gray-400
                             bg-white border border-gray-300
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                             transition-all duration-200 min-w-0"
                />
                <button
                  id="join-room-btn"
                  type="submit"
                  disabled={!isConnected || isLoading || joinCode.length !== 6}
                  className="px-5 py-2.5 rounded-lg font-bold text-white text-sm
                             bg-blue-600 hover:bg-blue-700
                             active:scale-[0.97]
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all duration-200 shadow-sm border border-blue-700"
                >
                  Join →
                </button>
              </div>
            </form>
          </StickyNote>
        </div>

        {/* Connection Status */}
        <div className="mt-8">
          <ConnectionStatus />
        </div>
      </div>
    </RouteTransition>
  );
};

export default Home;
