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
import RouteTransition from "../animations/RouteTransition";
import StickyNote from "../components/StickyNote";
import PresenceIndicator from "../components/PresenceIndicator";

/**
 * Lobby page: Displays the room code, player count,
 * and waiting/ready status. Allows copying the room code.
 * Customized for notebook and sticky note visual theme.
 */
const Lobby = () => {
  const { roomCode, playerSymbol, playerCount, roomStatus, isRoomReady, leaveRoom } =
    useRoom();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [dots, setDots] = useState("");

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

  // Looping status dots animation (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <RouteTransition>
      <div className="w-full max-w-md px-4 py-8 relative z-10">
        <Countdown />
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-3 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-amber-500/15 border border-yellow-500/15 shadow-sm">
              <span className="text-3xl animate-bounce">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide font-sans">Game Lobby</h1>
            <p className="mt-2 text-sm text-gray-400">
              {isReady
                ? "Both players connected!"
                : `Waiting for opponent to join${dots}`}
            </p>
          </div>

          {/* Room Code Card — Yellow Sticky Note Pinned */}
          <StickyNote color="yellow" rotation="rotate-[0.5deg]" className="mb-5 relative">
            {/* Pinned pushpin decoration */}
            <div className="absolute -top-3 left-6 text-2xl filter drop-shadow-sm select-none">📌</div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-3 pl-6 font-sans">
              Room Code
            </p>
            <div className="flex items-center gap-3 pl-6">
              <div className="flex-1 px-4 py-2.5 rounded-lg bg-white/60 border border-gray-300 text-center text-2xl font-mono font-bold tracking-[0.4em] text-gray-800 shadow-inner">
                {roomCode}
              </div>
              <button
                id="copy-code-btn"
                onClick={handleCopyCode}
                className={`px-4 py-3 rounded-lg text-xs font-bold transition-all duration-200 min-w-[90px] border shadow-sm ${
                  copied
                    ? "bg-emerald-600 border-emerald-700 text-white scale-[1.03]"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                }`}
              >
                {copied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500 pl-6 font-sans">
              Share this code with your friend to connect.
            </p>
          </StickyNote>

          {/* Players Card — Blue Sticky Note */}
          <StickyNote color="blue" rotation="rotate-[-1deg]" className="mb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-4 font-sans">
              Players Joined
            </p>
            
            <div className="space-y-3">
              {/* Player X */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border bg-white/60 border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-amber-500 font-handwritten">✕</span>
                  <span className="text-sm font-semibold text-gray-700 font-sans">
                    Player X {playerSymbol === "X" && <span className="text-amber-600 text-xs font-bold">(You)</span>}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-sans">Ready</span>
              </div>

              {/* Player O */}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-300 ${
                isReady ? "bg-white/60 border-gray-200" : "bg-white/30 border-dashed border-gray-300"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold font-handwritten ${isReady ? "text-blue-500" : "text-gray-400"}`}>○</span>
                  <span className={`text-sm font-semibold font-sans ${isReady ? "text-gray-700" : "text-gray-400"}`}>
                    {isReady ? (
                      <>
                        Player O {playerSymbol === "O" && <span className="text-blue-600 text-xs font-bold">(You)</span>}
                      </>
                    ) : (
                      <span>Waiting for player{dots}</span>
                    )}
                  </span>
                </div>
                {isReady ? (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-sans">Ready</span>
                ) : (
                  <span className="text-xs font-bold text-gray-400 italic font-handwritten">joining...</span>
                )}
              </div>
            </div>
          </StickyNote>

          {/* Connection & Presence Status — Pink Sticky Note */}
          <StickyNote color="pink" rotation="rotate-[1.5deg]" className="mb-6 py-4 px-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 font-sans">Connection Status</span>
              
              {/* Presence Indicator */}
              {!isConnected ? (
                <PresenceIndicator status="reconnecting" />
              ) : playerCount === 2 ? (
                <PresenceIndicator status="online" />
              ) : (
                <PresenceIndicator status="disconnected" />
              )}
            </div>
            
            <div className="mt-3 text-center text-sm font-semibold text-gray-700 font-handwritten text-xl">
              {!isConnected ? (
                "Connecting to server..."
              ) : playerCount === 2 ? (
                "Match starting soon!"
              ) : (
                <span>Waiting for opponent to connect{dots}</span>
              )}
            </div>
          </StickyNote>

          {/* Your Symbol Badge */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-white/5 border border-white/10 text-gray-300">
              You are playing as{" "}
              <span
                className={`font-bold text-sm ${
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
    </RouteTransition>
  );
};

export default Lobby;
