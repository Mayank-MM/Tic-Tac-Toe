import { motion } from "framer-motion";

/**
 * StickyNote: A styled card designed to look like a physical sticky note on a desk.
 * Uses realistic shadow curling, optional rotation, color variations, and a tape header.
 *
 * @param {object} props
 * @param {string} props.color - yellow | pink | blue | green
 * @param {string} props.rotation - Tailwind rotation classes (e.g. 'rotate-1', 'rotate-[-1.5deg]')
 * @param {boolean} props.animate - whether to apply Framer Motion entry physics
 */
const StickyNote = ({
  children,
  color = "yellow",
  rotation = "rotate-1",
  className = "",
  animate = true,
}) => {
  const colorClasses = {
    yellow: "bg-[#fff8bd] text-gray-800 border-[#f5eca2]",
    pink: "bg-[#ffd5df] text-gray-800 border-[#f8c4d0]",
    blue: "bg-[#cceeff] text-gray-800 border-[#b8ddf0]",
    green: "bg-[#d8ffd8] text-gray-800 border-[#c4eec4]",
  };

  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      initial={animate ? { scale: 0.95, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={animate ? { type: "spring", stiffness: 200, damping: 20 } : undefined}
      className={`sticky-note-shadow border border-dashed rounded-sm p-6 ${colorClasses[color]} ${rotation} ${className}`}
      style={{
        fontFamily: "var(--font-family)",
      }}
    >

      
      {/* Ruled lines background details inside the note (faint watermark) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(#000_1px,transparent_1px)] bg-[size:100%_24px] rounded-sm" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </Wrapper>
  );
};

export default StickyNote;
