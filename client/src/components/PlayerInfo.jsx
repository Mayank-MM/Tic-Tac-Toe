import { motion } from "framer-motion";
import { useGame } from "../contexts/GameContext";
import { useRoom } from "../contexts/RoomContext";

/**
 * PlayerInfo: Renders the active match profiles showing local symbols,
 * active player turns, and a ticking progress bar indicator.
 */
const PlayerInfo = () => {
  const { currentTurn, opponentDisconnected, gameStatus, turnTimeLeft } = useGame();
  const { playerSymbol } = useRoom();

  const isMyTurn = currentTurn === playerSymbol;
  const isActive = gameStatus === "playing" && !opponentDisconnected;

  return (
    <div className="w-full flex flex-col bg-gray-200/50 p-4 rounded-lg border-2 border-dashed border-gray-400/50 mb-8 gap-3">
      {/* Profiles Info Row */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">You Are</span>
          <span className="text-3xl font-extrabold text-gray-800">
            {playerSymbol === "X" ? "✕" : "○"}
          </span>
        </div>

        <div className="flex flex-col items-end">
          {opponentDisconnected ? (
            <>
              <span className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-1">Status</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                  Opponent Disconnected
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 flex items-center gap-2">
                {isMyTurn ? "Your Turn" : "Opponent's Turn"}
                {isActive && (
                  <motion.span
                    key={turnTimeLeft}
                    animate={(turnTimeLeft ?? 10) <= 3 ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded border border-dashed select-none ${
                      (turnTimeLeft ?? 10) <= 3
                        ? "text-red-600 bg-red-100 border-red-300 animate-pulse"
                        : "text-amber-700 bg-amber-50 border-amber-300"
                    }`}
                  >
                    {turnTimeLeft ?? 10}s
                  </motion.span>
                )}
              </span>
              <div className="flex items-center gap-2 justify-end">
                {isMyTurn && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
                <span className={`text-3xl font-extrabold ${isMyTurn ? "text-emerald-700" : "text-gray-800"}`}>
                  {currentTurn === "X" ? "✕" : "○"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visual Turn Timer Progress Bar */}
      {isActive && (
        <div className="w-full h-2 bg-gray-300/40 rounded-full overflow-hidden border border-dashed border-gray-400/50 relative">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${((turnTimeLeft ?? 10) / 10) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className={`h-full rounded-full transition-colors duration-300 ${
              (turnTimeLeft ?? 10) <= 3 ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;
