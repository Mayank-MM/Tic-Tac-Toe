import HandDrawnX from "./HandDrawnX";
import HandDrawnO from "./HandDrawnO";
import { useGame } from "../contexts/GameContext";

/**
 * Single cell of the Tic-Tac-Toe board.
 * Renders hand-sketched X and O components.
 */
const Cell = ({ value, index }) => {
  const { makeMove, opponentDisconnected } = useGame();

  return (
    <button
      onClick={() => makeMove(index)}
      disabled={value !== "" || opponentDisconnected}
      className={`w-full h-full flex items-center justify-center border-none bg-transparent cursor-pointer outline-none focus:outline-none transition-transform active:scale-90 duration-100 ${
        value !== "" || opponentDisconnected ? "cursor-default" : ""
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {value === "X" && <HandDrawnX className="w-12 h-12 md:w-16 md:h-16" />}
      {value === "O" && <HandDrawnO className="w-12 h-12 md:w-16 md:h-16" />}
    </button>
  );
};

export default Cell;
