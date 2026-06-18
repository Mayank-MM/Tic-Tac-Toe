import { useGame } from "../contexts/GameContext";
import Cell from "./Cell";
import BoardLineAnimation from "./BoardLineAnimation";
import WinningLine from "./WinningLine";

/**
 * NotebookBoard: Renders the 3x3 game board on the notebook paper.
 * Sequentially sketches the grid lines, then allows game cells to be selected.
 */
const NotebookBoard = () => {
  const { board, winningCells } = useGame();

  return (
    <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-square mx-auto my-6 select-none">
      {/* Hand-drawn grid lines drawing animation */}
      <BoardLineAnimation />

      {/* 9 clickable board cells */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
        {board.map((cellValue, index) => (
          <div key={index} className="w-full h-full relative">
            <Cell value={cellValue} index={index} />
          </div>
        ))}
      </div>

      {/* Draw pencil stroke across winning cells */}
      {winningCells && winningCells.length === 3 && (
        <WinningLine winningCells={winningCells} />
      )}
    </div>
  );
};

export default NotebookBoard;
