// ============================================
// Page: Game
// Handles the paper transition and game board
// ============================================

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRoom } from "../contexts/RoomContext";
import { GameProvider, useGame } from "../contexts/GameContext";
import useSocket from "../hooks/useSocket";
import PaperTransition from "../components/PaperTransition";
import GameHeader from "../components/GameHeader";
import PlayerInfo from "../components/PlayerInfo";
import NotebookBoard from "../components/NotebookBoard";
import Scoreboard from "../components/Scoreboard";
import PresenceIndicator from "../components/PresenceIndicator";
import ConnectionStatus from "../components/ConnectionStatus";
import RouteTransition from "../animations/RouteTransition";
import GameOverModal from "../components/GameOverModal";

const GameContent = () => {
  const { roomCode, isRoomReady, leaveRoom } = useRoom();
  const { toastMessage, opponentDisconnected, draw } = useGame();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(true);

  // Stabilize transition completion handler
  const handleTransitionComplete = useCallback(() => {
    setShowTransition(false);
  }, []);

  // Redirect if not properly initialized
  useEffect(() => {
    if (!roomCode || !isRoomReady) {
      navigate("/");
    }
  }, [roomCode, isRoomReady, navigate]);

  if (!roomCode || !isRoomReady) return null;

  return (
    <RouteTransition>
      <div className="w-full max-w-[500px] px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {showTransition ? (
          <PaperTransition onAnimationComplete={handleTransitionComplete} />
        ) : (
          <motion.div
            className="notebook-paper w-full rounded-xl shadow-2xl p-6 md:p-8 relative overflow-hidden text-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              draw
                ? { x: [-3, 3, -3, 3, 0], opacity: 1, scale: 1, transition: { x: { duration: 0.4 } } }
                : { opacity: 1, scale: 1, x: 0 }
            }
            transition={{ duration: 0.4 }}
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0,0,0,0.02)"
            }}
          >
            {/* Subtle paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#c4bead_1px,transparent_1px)] [background-size:20px_20px] rounded-xl" />
            
            {/* Margined game area layout (shifts text right of the red line) */}
            <div className="relative z-10 pl-10 pt-2">
              <GameHeader />
              
              {/* Opponent Connection Details */}
              <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-300 pb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-sans font-bold">
                  Connection
                </span>
                
                {opponentDisconnected ? (
                  <PresenceIndicator status="disconnected" />
                ) : !isConnected ? (
                  <PresenceIndicator status="reconnecting" />
                ) : (
                  <PresenceIndicator status="online" />
                )}
              </div>

              {/* Turn and symbol details */}
              <PlayerInfo />

              {/* Match Score */}
              <Scoreboard />
              
              {/* Imperfect Board Grid */}
              <NotebookBoard />
              
              {/* Custom Toast Notification for Invalid Moves */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-semibold text-center shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>⚠️</span>
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Exit Game Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={leaveRoom}
                  className="py-2.5 px-8 rounded-xl text-xs font-bold tracking-widest uppercase
                             text-red-600 hover:text-red-700
                             border-2 border-red-300 hover:border-red-500
                             bg-red-50/40 hover:bg-red-50
                             active:scale-[0.98]
                             transition-all duration-200 font-sans"
                >
                  Leave Game
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connection Status pinned to bottom */}
        {!showTransition && (
          <div className="mt-8">
            <ConnectionStatus />
          </div>
        )}

        {/* End Game Modal Dialog overlay */}
        <GameOverModal />
      </div>
    </RouteTransition>
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
