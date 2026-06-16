import { useGame } from "../contexts/GameContext";
import { useRoom } from "../contexts/RoomContext";

const PlayerInfo = () => {
  const { currentTurn } = useGame();
  const { playerSymbol } = useRoom();

  const isMyTurn = currentTurn === playerSymbol;

  return (
    <div className="w-full flex justify-between items-center bg-gray-200/50 p-4 rounded-lg border-2 border-dashed border-gray-400/50 mb-8">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">You Are</span>
        <span className="text-3xl font-extrabold text-gray-800">
          {playerSymbol === "X" ? "✕" : "○"}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">Current Turn</span>
        <div className="flex items-center gap-2">
          {isMyTurn && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Your Turn</span>}
          <span className={`text-3xl font-extrabold ${isMyTurn ? "text-emerald-700" : "text-gray-800"}`}>
            {currentTurn === "X" ? "✕" : "○"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
