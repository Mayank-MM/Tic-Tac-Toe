import { motion } from "framer-motion";

/**
 * HandDrawnX: Renders an organically sketched "X" mark.
 * Animates the two strokes sequentially to look like it is being hand-drawn.
 */
const HandDrawnX = ({ className = "w-16 h-16" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} text-gray-700`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stroke 1: Top-Left to Bottom-Right */}
      <motion.path
        d="M 22 24 Q 48 48 78 76"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      {/* Stroke 2: Top-Right to Bottom-Left */}
      <motion.path
        d="M 76 22 Q 52 50 24 78"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.15, duration: 0.2, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default HandDrawnX;
