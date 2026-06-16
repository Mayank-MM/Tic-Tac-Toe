// ============================================
// Page: Game
// Handles the paper transition and game board
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRoom } from "../contexts/RoomContext";
import { GameProvider } from "../contexts/GameContext";
import PaperTransition from "../components/PaperTransition";
import GameHeader from "../components/GameHeader";
import PlayerInfo from "../components/PlayerInfo";
import Board from "../components/Board";
import ConnectionStatus from "../components/ConnectionStatus";

const GameContent = () => {
  const { roomCode, isRoomReady, leaveRoom } = useRoom();
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(true);

  // Redirect if not properly initialized
  useEffect(() => {
    if (!roomCode || !isRoomReady) {
      navigate("/");
    }
  }, [roomCode, isRoomReady, navigate]);

  if (!roomCode || !isRoomReady) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
      {showTransition ? (
        <PaperTransition onAnimationComplete={() => setShowTransition(false)} />
      ) : (
        <motion.div
          className="w-full max-w-[500px] bg-[#f4f1ea] rounded-xl shadow-2xl p-6 md:p-10 relative overflow-hidden text-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0,0,0,0.02)"
          }}
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#c4bead_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10">
            <GameHeader />
            <PlayerInfo />
            <Board />
            
            <div className="mt-12 flex justify-center">
              <button
                onClick={leaveRoom}
                className="py-3 px-8 rounded-xl text-sm font-bold tracking-widest uppercase
                           text-red-500 hover:text-red-700
                           border-2 border-red-200 hover:border-red-400
                           bg-transparent hover:bg-red-50
                           active:scale-[0.98]
                           transition-all duration-200"
              >
                Leave Game
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connection Status pinned to bottom */}
      {!showTransition && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <ConnectionStatus />
        </div>
      )}
    </div>
  );
};

const Game = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Game;
