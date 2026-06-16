import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PaperTransition = ({ onAnimationComplete }) => {
  const [phase, setPhase] = useState("crumpled"); // 'crumpled', 'unfolding', 'flat'

  useEffect(() => {
    // Sequence the phases
    const unfoldTimer = setTimeout(() => setPhase("unfolding"), 600);
    const flatTimer = setTimeout(() => setPhase("flat"), 1600);
    const completeTimer = setTimeout(() => onAnimationComplete(), 2400);

    return () => {
      clearTimeout(unfoldTimer);
      clearTimeout(flatTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  // Framer Motion variants for the overall container
  const containerVariants = {
    crumpled: { scale: 0.5, rotate: -15 },
    unfolding: { scale: 0.8, rotate: 5, transition: { duration: 0.8, ease: "easeOut" } },
    flat: { scale: 1, rotate: 0, transition: { duration: 0.8, ease: "anticipate" } },
  };

  // The crumpled paper ball SVG
  const CrumpledSVG = () => (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full text-[#e6e2d8]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "flat" ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <path
        fill="currentColor"
        stroke="#c4bead"
        strokeWidth="2"
        d="M20,30 Q30,10 50,15 T80,30 Q90,50 85,70 T60,90 Q40,95 25,80 T20,30 Z"
      />
      <path fill="none" stroke="#c4bead" strokeWidth="1" d="M30,40 Q45,25 60,35" />
      <path fill="none" stroke="#c4bead" strokeWidth="1" d="M40,60 Q55,80 70,55" />
      <path fill="none" stroke="#c4bead" strokeWidth="1" d="M35,70 Q25,50 45,45" />
      <path fill="none" stroke="#c4bead" strokeWidth="1" d="M75,40 Q65,60 80,65" />
    </motion.svg>
  );

  // The flat paper rectangle
  const FlatPaperSVG = () => (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full text-[#f4f1ea]"
      preserveAspectRatio="none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: phase === "flat" ? 1 : 0,
        scale: phase === "flat" ? 1 : 0.8
      }}
      transition={{ duration: 0.8 }}
    >
      <rect x="5" y="5" width="90" height="90" rx="2" fill="currentColor" />
      {/* Subtle paper texture/wrinkles fading away */}
      <motion.path
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        fill="none" stroke="#e0dbcc" strokeWidth="0.5"
        d="M10,20 Q30,15 90,25 M15,50 Q50,45 85,55 M20,80 Q60,75 80,85"
      />
    </motion.svg>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        className="relative w-64 h-64 md:w-96 md:h-96"
        variants={containerVariants}
        initial="crumpled"
        animate={phase}
      >
        <FlatPaperSVG />
        <CrumpledSVG />
      </motion.div>
    </div>
  );
};

export default PaperTransition;
