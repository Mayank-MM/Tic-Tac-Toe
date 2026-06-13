// ============================================
// Page: Home
// Landing page — displays title & socket status
// ============================================

import ConnectionStatus from "../components/ConnectionStatus";

/**
 * Home page: The main landing screen for Phase 1.
 * Shows the game title, a brief tagline, and the live
 * Socket.IO connection status badge.
 */
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
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

        {/* Divider */}
        <div className="mt-8 mb-6 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Socket Status Section */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-2">
            Socket Status
          </p>
          <ConnectionStatus />
        </div>
      </div>

      {/* Phase indicator */}
      <div
        className="mt-16 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Phase 1 — Foundation Setup ✓
        </span>
      </div>
    </div>
  );
};

export default Home;
