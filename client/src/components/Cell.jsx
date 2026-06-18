import { motion } from "framer-motion";
import HandDrawnX from "./HandDrawnX";
import HandDrawnO from "./HandDrawnO";
import { useGame } from "../contexts/GameContext";

/**
 * Single cell of the Tic-Tac-Toe board.
 * Renders hand-sketched X and O components with winning animations.
 */
const Cell = ({ value, index }) => {
  const { makeMove, opponentDisconnected, gameStatus, winningCells } = useGame();

  const isWinning = winningCells && winningCells.includes(index);
  const isDisabled = value !== "" || opponentDisconnected || gameStatus === "finished";

  // Dynamic filter glow depending on symbol
  const glowStyle = isWinning
    ? {
        filter: value === "X"
          ? "drop-shadow(0 0 12px rgba(217, 119, 6, 0.75))"
          : "drop-shadow(0 0 12px rgba(37, 99, 235, 0.75))"
      }
    : {};

  return (
    <motion.button
      onClick={() => makeMove(index)}
      disabled={isDisabled}
      animate={isWinning ? { scale: 1.08 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`w-full h-full flex items-center justify-center border-none bg-transparent cursor-pointer outline-none focus:outline-none transition-transform relative z-10 ${
        isDisabled ? "cursor-default" : "active:scale-95 duration-100"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Yellow highlighter background effect for winning cells */}
      {isWinning && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.45 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          className="absolute inset-2 bg-amber-200 rounded-md -z-10 origin-left"
          style={{ filter: "blur(2.5px)" }}
        />
      )}

      <div style={glowStyle} className="flex items-center justify-center">
        {value === "X" && <HandDrawnX className="w-12 h-12 md:w-16 md:h-16" />}
        {value === "O" && <HandDrawnO className="w-12 h-12 md:w-16 md:h-16" />}
      </div>
    </motion.button>
  );
};

export default Cell;
