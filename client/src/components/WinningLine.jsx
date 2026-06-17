import { motion } from "framer-motion";

/**
 * WinningLine: A reusable component to draw a pencil stroke across the winning cells.
 * Maps type configurations ('h0'-'h2', 'v0'-'v2', 'd0'-'d1') to SVG paths.
 *
 * @param {object} props
 * @param {string} props.type - h0 | h1 | h2 | v0 | v1 | v2 | d0 | d1
 * @param {string} props.color - CSS color class for the stroke
 */
const WinningLine = ({ type = "h0", color = "text-red-500/80" }) => {
  // SVG coordinates mapping for win configurations on the 300x300 canvas
  const paths = {
    h0: "M 15 50 Q 150 48 285 52",
    h1: "M 15 150 Q 150 152 285 148",
    h2: "M 15 250 Q 150 248 285 252",
    v0: "M 50 15 Q 48 150 52 285",
    v1: "M 150 15 Q 152 150 148 285",
    v2: "M 250 15 Q 248 150 252 285",
    d0: "M 20 20 Q 150 150 280 280",
    d1: "M 280 20 Q 150 150 20 280",
  };

  const selectedPath = paths[type] || paths.h0;

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-30 ${color}`}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={selectedPath}
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </svg>
  );
};

export default WinningLine;
