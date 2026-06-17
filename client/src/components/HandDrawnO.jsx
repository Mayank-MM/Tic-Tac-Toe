import { motion } from "framer-motion";

/**
 * HandDrawnO: Renders an organically sketched "O" circle.
 * Animates the circular stroke to look like it is being hand-drawn.
 */
const HandDrawnO = ({ className = "w-16 h-16" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} text-gray-700`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle stroke that doesn't align perfectly at the seam */}
      <motion.path
        d="M 50 15 C 24 15 14 43 18 71 C 22 93 78 93 84 71 C 89 43 78 15 52 17"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default HandDrawnO;
