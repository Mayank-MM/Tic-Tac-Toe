import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../contexts/GameContext";
import { useRoom } from "../contexts/RoomContext";
import WinnerBanner from "./WinnerBanner";
import DrawBanner from "./DrawBanner";

/**
 * GameOverModal: Renders a hand-drawn memo pad dialog when the game ends.
 * Showcases match outcome, current scores, and rematch / leave controls.
 */
const GameOverModal = () => {
  const {
    gameStatus,
    draw,
    scores,
    opponentDisconnected,
    rematchRequested,
    waitingForOpponent,
    requestRematch,
  } = useGame();
  const { leaveRoom } = useRoom();

  const isFinished = gameStatus === "finished";

  return (
    <AnimatePresence>
      {isFinished && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          {/* Hand-drawn style sticky note or memo pad */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-[360px] bg-[#fffef0] border-2 border-gray-800 rounded-lg p-6 shadow-2xl relative rotate-1 font-sans"
            style={{
              backgroundImage: "linear-gradient(#f0edd5 1px, transparent 1px)",
              backgroundSize: "100% 24px",
              boxShadow: "8px 8px 0px rgba(31, 41, 55, 1)"
            }}
          >
            {/* Notebook binder holes at the top */}
            <div className="absolute top-2 left-0 right-0 flex justify-around px-8 pointer-events-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-gray-800/15 border border-gray-800/35" />
              ))}
            </div>

            <div className="mt-4 text-center">
              {draw ? <DrawBanner /> : <WinnerBanner />}

              {/* Match scorecard table */}
              <div className="my-6 border-2 border-dashed border-gray-400 p-4 rounded-md bg-white/60 font-handwritten">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-sans font-bold mb-2">
                  Match Scorecard
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-gray-800">
                  <div className="flex flex-col items-center">
                    <div className="text-[11px] font-sans uppercase tracking-wider text-gray-400">✕ Wins</div>
                    <div className="text-2xl font-bold text-amber-600">{scores.x || 0}</div>
                  </div>
                  <div className="flex flex-col items-center border-l border-r border-gray-300">
                    <div className="text-[11px] font-sans uppercase tracking-wider text-gray-400">Draws</div>
                    <div className="text-2xl font-bold text-gray-500">{scores.draws || 0}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[11px] font-sans uppercase tracking-wider text-gray-400">○ Wins</div>
                    <div className="text-2xl font-bold text-blue-600">{scores.o || 0}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                {opponentDisconnected ? (
                  /* Opponent left — no rematch possible */
                  <div className="py-3 px-6 rounded-lg text-sm font-semibold text-gray-500 bg-gray-100 border-2 border-dashed border-gray-300 font-sans text-center">
                    Opponent has left the room
                  </div>
                ) : waitingForOpponent ? (
                  /* Local player requested — waiting for opponent */
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="py-3 px-6 rounded-lg text-sm font-bold uppercase tracking-wider
                               text-amber-700 bg-amber-50 border-2 border-dashed border-amber-400
                               font-sans text-center cursor-default"
                  >
                    Waiting for opponent…
                  </motion.div>
                ) : (
                  /* Default — Play Again button */
                  <button
                    onClick={requestRematch}
                    className="w-full py-3 px-6 rounded-lg text-sm font-bold uppercase tracking-wider
                               text-emerald-700 bg-emerald-50 border-2 border-gray-800 hover:bg-emerald-100
                               active:scale-[0.98] transition-all duration-200 font-sans
                               shadow-[2px_2px_0px_rgba(31,41,55,1)] hover:shadow-none"
                  >
                    Play Again
                  </button>
                )}
                
                <button
                  onClick={leaveRoom}
                  className="py-3 px-6 rounded-lg text-sm font-bold uppercase tracking-wider
                             text-white bg-red-600 border-2 border-gray-800 hover:bg-red-700
                             active:scale-[0.98] transition-all duration-200 font-sans shadow-[2px_2px_0px_rgba(31,41,55,1)] hover:shadow-none"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;
