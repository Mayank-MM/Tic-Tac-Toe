import { motion } from "framer-motion";
import { useGame } from "../contexts/GameContext";

/**
 * Single cell of the Tic-Tac-Toe board.
 * Uses a pencil-like font/style for X and O.
 */
const Cell = ({ value, index }) => {
  const { makeMove, opponentDisconnected } = useGame();

  return (
    <button
      onClick={() => makeMove(index)}
      disabled={value !== "" || opponentDisconnected}
      className={`w-full h-full flex items-center justify-center border-none bg-transparent cursor-pointer outline-none focus:outline-none transition-transform active:scale-95 duration-100 ${
        (value !== "" || opponentDisconnected) ? "cursor-default" : ""
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {value === "X" && (
        <motion.svg
          viewBox="0 0 100 100"
          className="w-16 h-16 md:w-24 md:h-24 text-gray-800"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Hand-drawn looking X */}
          <path
            d="M 20 20 Q 50 45 80 80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 80 20 Q 50 55 20 80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {value === "O" && (
        <motion.svg
          viewBox="0 0 100 100"
          className="w-16 h-16 md:w-24 md:h-24 text-gray-800"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Hand-drawn looking O */}
          <path
            d="M 50 10 C 20 10 10 40 15 70 C 20 95 80 95 85 70 C 90 40 80 10 50 10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      )}
    </button>
  );
};

export default Cell;
