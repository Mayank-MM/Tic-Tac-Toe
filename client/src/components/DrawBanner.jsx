import { motion } from "framer-motion";

/**
 * DrawBanner: Displays a handwritten styled notification banner
 * showing "It's a Draw!" when a draw condition is reached.
 */
const DrawBanner = () => {
  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, rotate: 5 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, 3, -3, 1, 0] }}
      transition={{ type: "spring", duration: 0.6 }}
      className="text-center py-4 px-6 my-4 rounded-lg font-handwritten text-4xl font-extrabold bg-gray-100/80 border-2 border-dashed border-gray-400 text-gray-700"
    >
      🤝 It's a Draw! 🤝
    </motion.div>
  );
};

export default DrawBanner;
