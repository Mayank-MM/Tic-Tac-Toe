import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRoom } from "./RoomContext";
import socket from "../socket/socket";

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { roomCode, playerSymbol } = useRoom();
  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Hardcoded for compatibility with previous scaffolding (no win/draw checks allowed in this phase)
  const gameStatus = "playing";
  const winner = null;

  // Auto-hide toast message
  const showToast = useCallback((message) => {
    setToastMessage(message);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  // Handle client-side turn and empty-cell validation before emitting
  const makeMove = useCallback((index) => {
    if (opponentDisconnected) {
      showToast("Game is over. Opponent disconnected.");
      return;
    }

    if (board[index] !== "") {
      showToast("Invalid Move: Cell already occupied");
      return;
    }

    if (currentTurn !== playerSymbol) {
      showToast("Invalid Move: Not your turn");
      return;
    }

    // Emit to server - do NOT update local state immediately (server-authoritative)
    socket.emit("make-move", {
      roomCode,
      cellIndex: index,
    });
  }, [board, currentTurn, playerSymbol, roomCode, opponentDisconnected, showToast]);

  // Set up socket event listeners
  useEffect(() => {
    const handleBoardUpdated = (data) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
    };

    const handleInvalidMove = (data) => {
      showToast(data.reason || "Invalid Move");
    };

    const handlePlayerLeft = () => {
      setOpponentDisconnected(true);
    };

    socket.on("board-updated", handleBoardUpdated);
    socket.on("invalid-move", handleInvalidMove);
    socket.on("player-left", handlePlayerLeft);

    return () => {
      socket.off("board-updated", handleBoardUpdated);
      socket.off("invalid-move", handleInvalidMove);
      socket.off("player-left", handlePlayerLeft);
    };
  }, [showToast]);

  const value = {
    board,
    currentTurn,
    gameStatus,
    winner,
    opponentDisconnected,
    toastMessage,
    makeMove,
    clearToast,
    showToast,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
