import { motion } from "framer-motion";
import { useGame } from "../contexts/GameContext";
import { useRoom } from "../contexts/RoomContext";

/**
 * WinnerBanner: Displays a handwritten styled notification banner
 * showing "You Win!" or "You Lose!" depending on who the local player is.
 */
const WinnerBanner = () => {
  const { winner } = useGame();
  const { playerSymbol } = useRoom();

  const isWinner = winner === playerSymbol;

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, -3, 3, -1, 0] }}
      transition={{ type: "spring", duration: 0.6 }}
      className={`text-center py-4 px-6 my-4 rounded-lg font-handwritten text-4xl font-extrabold ${
        isWinner
          ? "bg-amber-100/80 border-2 border-dashed border-amber-400 text-amber-800 rotate-1 shadow-sm"
          : "bg-red-50/80 border-2 border-dashed border-red-300 text-red-700 -rotate-1 shadow-sm"
      }`}
    >
      {isWinner ? "✨ You Win! ✨" : "💀 You Lose! 💀"}
    </motion.div>
  );
};

export default WinnerBanner;
