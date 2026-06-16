import { motion } from "framer-motion";

/**
 * Single cell of the Tic-Tac-Toe board.
 * Uses a pencil-like font/style for X and O.
 */
const Cell = ({ value, index }) => {
  // We'll use Framer Motion to draw the X and O when they appear
  // For now, no click logic is implemented.

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {value === "X" && (
        <motion.svg
          viewBox="0 0 100 100"
          className="w-16 h-16 md:w-24 md:h-24 text-gray-800"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Hand-drawn looking X */}
          <motion.path
            d="M 20 20 Q 50 45 80 80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.path
            d="M 80 20 Q 50 55 20 80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            transition={{ delay: 0.2, duration: 0.4 }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        </motion.svg>
      )}

      {value === "O" && (
        <motion.svg
          viewBox="0 0 100 100"
          className="w-16 h-16 md:w-24 md:h-24 text-gray-800"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Hand-drawn looking O */}
          <motion.path
            d="M 50 10 C 20 10 10 40 15 70 C 20 95 80 95 85 70 C 90 40 80 10 50 10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      )}
    </div>
  );
};

export default Cell;
