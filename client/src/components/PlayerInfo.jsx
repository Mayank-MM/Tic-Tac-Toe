import { useGame } from "../contexts/GameContext";
import { useRoom } from "../contexts/RoomContext";

const PlayerInfo = () => {
  const { currentTurn, opponentDisconnected } = useGame();
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
        {opponentDisconnected ? (
          <>
            <span className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-1">Status</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                Opponent Disconnected
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              {isMyTurn ? "Your Turn" : "Opponent's Turn"}
            </span>
            <div className="flex items-center gap-2 justify-end">
              {isMyTurn && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
              <span className={`text-3xl font-extrabold ${isMyTurn ? "text-emerald-700" : "text-gray-800"}`}>
                {currentTurn === "X" ? "✕" : "○"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
