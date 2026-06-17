import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 15,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -15,
  },
};

const pageTransition = {
  duration: 0.35,
  ease: "easeInOut",
};

/**
 * RouteTransition wraps page components to handle route change animations.
 * Provides a smooth fade + slide + scale transition.
 */
const RouteTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full min-h-screen flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
