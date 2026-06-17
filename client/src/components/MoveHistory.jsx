import { useGame } from "../contexts/GameContext";

/**
 * MoveHistory: Displays a compact list of historical moves in a notebook-journal aesthetic.
 * Auto-scrolls to show the latest entries.
 */
const MoveHistory = () => {
  const { moveHistory } = useGame();

  return (
    <div className="w-full bg-[#fbf9f3] border border-gray-300 rounded-lg p-4 shadow-sm font-handwritten select-none min-h-[110px] max-h-[160px] flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-2">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-sans font-bold">
          Move Log
        </h4>
        <span className="text-xs text-gray-400 font-sans">{moveHistory.length} moves</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {moveHistory.length === 0 ? (
          <p className="text-gray-400 italic text-xs py-2 text-center">
            Pencil marks will appear here...
          </p>
        ) : (
          <ul className="space-y-1.5 text-base font-bold text-gray-700">
            {moveHistory.map((move, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-dashed border-gray-200 pb-0.5 text-shadow-xs"
              >
                <span>
                  Move {move.number}:{" "}
                  <span
                    className={move.symbol === "X" ? "text-amber-600" : "text-blue-600"}
                  >
                    {move.symbol}
                  </span>
                </span>
                <span className="text-gray-500">→ {move.cellName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
