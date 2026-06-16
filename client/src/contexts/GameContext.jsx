import { createContext, useContext, useState, useCallback } from "react";

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null); // 'X' or 'O'

  // We will implement actual moves in the next phase.
  // For now, this is just scaffolding.
  const makeMove = useCallback((index) => {
    // Placeholder
  }, []);

  const value = {
    board,
    currentTurn,
    gameStatus,
    winner,
    makeMove,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
