import { motion } from "framer-motion";

/**
 * EraserReset: A reusable animation component representing an eraser block sweeping
 * across the board to clear all marks during a game reset.
 *
 * @param {object} props
 * @param {function} props.onComplete - callback triggered once eraser leaves the board
 */
const EraserReset = ({ onComplete }) => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-40">
      {/* Pink eraser block sweeping from left to right */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
        onAnimationComplete={onComplete}
        className="absolute inset-y-0 w-28 bg-[#f5a2b3] border-l-4 border-r-4 border-[#e88fa2]
                   shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center"
        style={{
          boxShadow: "inset 0 0 16px rgba(0,0,0,0.1), 5px 0 15px rgba(0,0,0,0.15)",
        }}
      >
        {/* Soft pencil-like label on the eraser */}
        <div className="text-[11px] font-sans font-bold text-[#b05265] uppercase tracking-[0.25em] rotate-90 whitespace-nowrap">
          Eraser
        </div>
      </motion.div>
    </div>
  );
};

export default EraserReset;
