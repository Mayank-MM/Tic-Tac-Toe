import { motion } from "framer-motion";

/**
 * PaperUnfold: A reusable layout wrapper that plays a physical paper-unfolding
 * scale, rotation, and opacity transition.
 */
const PaperUnfold = ({ children, isUnfolded = true }) => {
  const containerVariants = {
    crumpled: {
      scale: 0.5,
      rotate: -15,
      opacity: 0,
    },
    unfolding: {
      scale: 0.8,
      rotate: 5,
      opacity: 0.85,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    flat: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "anticipate" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="crumpled"
      animate={isUnfolded ? "flat" : "crumpled"}
      className="w-full h-full relative"
    >
      {children}
    </motion.div>
  );
};

export default PaperUnfold;
