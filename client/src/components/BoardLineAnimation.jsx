import { motion } from "framer-motion";

/**
 * BoardLineAnimation: Renders and animates the 4 hand-drawn grid lines.
 * Strokes are sketched sequentially (Top Horiz -> Bottom Horiz -> Left Vert -> Right Vert)
 * taking exactly 1 second in total duration.
 */
const BoardLineAnimation = () => {
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (index) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: index * 0.22, // Delay line drawing sequentially
        duration: 0.28,      // Speed of drawing individual strokes
        ease: "easeInOut",
      },
    }),
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full text-gray-600 pointer-events-none z-10"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none">
        {/* Top Horizontal Grid Line */}
        <motion.path
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          d="M 12 100 Q 150 104 288 96"
        />
        {/* Bottom Horizontal Grid Line */}
        <motion.path
          custom={1}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          d="M 10 200 Q 150 196 290 204"
        />
        {/* Left Vertical Grid Line */}
        <motion.path
          custom={2}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          d="M 100 12 Q 104 150 96 288"
        />
        {/* Right Vertical Grid Line */}
        <motion.path
          custom={3}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          d="M 200 10 Q 196 150 204 290"
        />
      </g>
    </svg>
  );
};

export default BoardLineAnimation;
