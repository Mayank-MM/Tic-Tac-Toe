// ============================================
// Page: Lobby
// Waiting room — shows room code & player status
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../contexts/RoomContext";
import useSocket from "../hooks/useSocket";
import ConnectionStatus from "../components/ConnectionStatus";
import Countdown from "../components/Countdown";

/**
 * Lobby page: Displays the room code, player count,
 * and waiting/ready status. Allows copying the room code
 * to clipboard for sharing.
 */
const Lobby = () => {
  const { roomCode, playerSymbol, playerCount, roomStatus, isRoomReady, leaveRoom } =
    useRoom();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Redirect to game when ready
  useEffect(() => {
    if (isRoomReady && roomCode) {
      navigate(`/room/${roomCode}/game`);
    }
  }, [isRoomReady, roomCode, navigate]);

  // Redirect to home if no room is active
  useEffect(() => {
    if (!roomCode) {
      navigate("/");
    }
  }, [roomCode, navigate]);

  // Copy room code to clipboard
  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!roomCode) return null;

  const isReady = roomStatus === "ready" && playerCount === 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      <Countdown />
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-3 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/20">
            <span className="text-3xl">🎮</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Game Lobby</h1>
          <p className="mt-2 text-sm text-gray-400">
            {isReady
              ? "Both players connected!"
              : "Waiting for opponent to join..."}
          </p>
        </div>

        {/* Room Code Card */}
        <div className="glass-card p-6 mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-3">
            Room Code
          </p>
          <div className="flex items-center gap-3">
            {/* Room code display */}
            <div
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                          text-center text-2xl font-mono font-bold tracking-[0.4em] text-white"
            >
              {roomCode}
            </div>
            {/* Copy button */}
            <button
              id="copy-code-btn"
              onClick={handleCopyCode}
              className="px-4 py-3 rounded-xl text-sm font-medium
                         bg-white/5 border border-white/10 text-gray-300
                         hover:bg-white/10 hover:text-white
                         active:scale-[0.96]
                         transition-all duration-200
                         min-w-[80px]"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            Share this code with your friend to join
          </p>
        </div>

        {/* Players Card */}
        <div className="glass-card p-6 mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-4">
            Players
          </p>

          {/* Player Count */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-400">Players in room</span>
            <span className="text-lg font-bold text-white">
              {playerCount}{" "}
              <span className="text-gray-500 font-normal">/ 2</span>
            </span>
          </div>

          {/* Player List */}
          <div className="space-y-3">
            {/* Player X (Host) */}
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                playerSymbol === "X"
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <span className="text-xl font-bold text-yellow-400">✕</span>
              <span className="text-sm text-white font-medium flex-1">
                Player X{" "}
                {playerSymbol === "X" && (
                  <span className="text-yellow-400 text-xs">(You)</span>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-xs text-white">Ready</span>
              </span>
            </div>

            {/* Player O (Opponent) */}
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                playerSymbol === "O"
                  ? "bg-white/10 border-white/20"
                  : isReady
                  ? "bg-white/5 border-white/10"
                  : "bg-white/[0.02] border-white/5 border-dashed"
              }`}
            >
              <span
                className={`text-xl font-bold ${
                  isReady ? "text-white" : "text-gray-600"
                }`}
              >
                ○
              </span>
              <span
                className={`text-sm font-medium flex-1 ${
                  isReady ? "text-white" : "text-gray-600"
                }`}
              >
                {isReady ? (
                  <>
                    Player O{" "}
                    {playerSymbol === "O" && (
                      <span className="text-white text-xs">(You)</span>
                    )}
                  </>
                ) : (
                  "Waiting for player..."
                )}
              </span>
              {isReady ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-xs text-white">Ready</span>
                </span>
              ) : (
                <svg
                  className="animate-spin h-4 w-4 text-gray-600"
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
              )}
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-card p-5 mb-4">
          <div className="flex items-center justify-center gap-3">
            {isReady ? (
              <>
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-medium text-white">
                  Opponent Connected — Ready to play!
                </span>
              </>
            ) : !isConnected ? (
              <>
                <span className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm font-medium text-red-400">
                  Connection Lost
                </span>
              </>
            ) : (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
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
                <span className="text-sm text-gray-400">
                  Waiting for opponent...
                </span>
              </>
            )}
          </div>
        </div>

        {/* Your Symbol Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-white/5 border border-white/10 text-gray-300">
            You are playing as{" "}
            <span
              className={`font-bold text-base ${
                playerSymbol === "X" ? "text-yellow-400" : "text-white"
              }`}
            >
              {playerSymbol === "X" ? "✕" : "○"}
            </span>
          </span>
        </div>

        {/* Leave Button */}
        <button
          id="leave-room-btn"
          onClick={leaveRoom}
          className="w-full py-3 px-6 rounded-xl text-sm font-medium
                     text-gray-400 hover:text-red-400
                     bg-white/5 border border-white/10
                     hover:bg-red-500/10 hover:border-red-500/20
                     active:scale-[0.98]
                     transition-all duration-200"
        >
          Leave Room
        </button>

        {/* Connection Status */}
        <div className="mt-6 flex justify-center">
          <ConnectionStatus />
        </div>
      </div>
    </div>
  );
};

export default Lobby;
