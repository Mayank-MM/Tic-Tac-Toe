import { motion } from "framer-motion";
import { useGame } from "../contexts/GameContext";
import Cell from "./Cell";

/**
 * Tic-Tac-Toe Board.
 * Animates the drawing of the 4 grid lines using Framer Motion SVG path animation.
 * Then reveals the 9 cells.
 */
const Board = () => {
  const { board } = useGame();

  // Sequence the grid line drawings
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.4, // sequential delay for each line
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto my-8">
      {/* The 4 grid lines */}
      <svg
        className="absolute inset-0 w-full h-full text-gray-700 pointer-events-none z-10"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none">
          {/* Horizontal Line 1 */}
          <motion.path
            custom={0}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            d="M 0 100 Q 150 105 300 95" // slightly wavy
          />
          {/* Horizontal Line 2 */}
          <motion.path
            custom={1}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            d="M 0 200 Q 150 195 300 205"
          />
          {/* Vertical Line 1 */}
          <motion.path
            custom={2}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            d="M 100 0 Q 105 150 95 300"
          />
          {/* Vertical Line 2 */}
          <motion.path
            custom={3}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            d="M 200 0 Q 195 150 205 300"
          />
        </g>
      </svg>

      {/* The 9 clickable cells */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
        {board.map((cellValue, index) => (
          <div key={index} className="w-full h-full relative">
            <Cell value={cellValue} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
