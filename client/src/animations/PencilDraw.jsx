import { motion } from "framer-motion";

/**
 * PencilDraw: A reusable animation helper to sketch child SVG paths sequentially.
 * Leverages the strokeDasharray/strokeDashoffset technique in Framer Motion.
 */
const PencilDraw = ({
  children,
  duration = 0.4,
  delay = 0,
  className = "",
}) => {
  return (
    <motion.g
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration, delay, ease: "easeInOut" },
        opacity: { duration: 0.1, delay },
      }}
      className={className}
    >
      {children}
    </motion.g>
  );
};

export default PencilDraw;
