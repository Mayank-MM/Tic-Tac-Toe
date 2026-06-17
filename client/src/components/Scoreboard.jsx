import { useGame } from "../contexts/GameContext";

/**
 * Scoreboard: Displays X wins, O wins, and Draws using a notebook-inspired counter slate.
 * Ready for future rematch integrations.
 */
const Scoreboard = () => {
  const { scores } = useGame();

  return (
    <div className="w-full flex justify-around items-center bg-[#fbf9f3] border-2 border-dashed border-gray-300 p-3.5 rounded-lg font-handwritten text-lg font-bold text-gray-800 shadow-sm select-none">
      {/* X Wins */}
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-sans mb-0.5">
          ✕ Wins
        </span>
        <span className="text-2xl text-amber-600 font-bold">{scores?.x || 0}</span>
      </div>

      <div className="h-8 w-px bg-gray-300" />

      {/* Draws */}
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-sans mb-0.5">
          Draws
        </span>
        <span className="text-2xl text-gray-500 font-bold">{scores?.draws || 0}</span>
      </div>

      <div className="h-8 w-px bg-gray-300" />

      {/* O Wins */}
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-sans mb-0.5">
          ○ Wins
        </span>
        <span className="text-2xl text-blue-600 font-bold">{scores?.o || 0}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
