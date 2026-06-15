// ============================================
// Page: Game (Placeholder)
// ============================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../contexts/RoomContext";
import ConnectionStatus from "../components/ConnectionStatus";

const Game = () => {
  const { roomCode, playerSymbol, isRoomReady, leaveRoom } = useRoom();
  const navigate = useNavigate();

  // Redirect if not properly initialized
  useEffect(() => {
    if (!roomCode || !isRoomReady) {
      navigate("/");
    }
  }, [roomCode, isRoomReady, navigate]);

  if (!roomCode || !isRoomReady) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md animate-fade-in-up text-center">
        {/* Header */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-gray-300/20 border border-white/20">
          <span className="text-4xl">⚔️</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Game Started</h1>
        
        <div className="glass-card p-6 my-8 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-1">Room</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-white">{roomCode}</p>
          </div>
          
          <div className="h-px bg-white/10 w-full" />
          
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-1">You are playing as</p>
            <p className={`text-5xl font-extrabold mt-2 ${playerSymbol === "X" ? "text-yellow-400" : "text-white"}`}>
              {playerSymbol === "X" ? "✕" : "○"}
            </p>
          </div>
        </div>

        <p className="text-gray-400 mb-8">(Game board and logic coming in next phase)</p>

        {/* Leave Button */}
        <button
          onClick={leaveRoom}
          className="py-3 px-8 rounded-xl text-sm font-medium
                     text-gray-400 hover:text-red-400
                     bg-white/5 border border-white/10
                     hover:bg-red-500/10 hover:border-red-500/20
                     active:scale-[0.98]
                     transition-all duration-200"
        >
          Leave Game
        </button>

        {/* Connection Status */}
        <div className="mt-8 flex justify-center">
          <ConnectionStatus />
        </div>
      </div>
    </div>
  );
};

export default Game;
