// ============================================
// Context: RoomContext
// Manages room state across the application
// ============================================

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const RoomContext = createContext(null);

/**
 * RoomProvider wraps the app and provides room state + actions.
 * State: roomCode, playerSymbol, playerCount, roomStatus, error
 * Actions: createRoom, joinRoom, leaveRoom
 */
export const RoomProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [roomStatus, setRoomStatus] = useState(null); // waiting | ready
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ─── CREATE ROOM ────────────────────────────────────
  const createRoom = useCallback(() => {
    setIsLoading(true);
    setError(null);

    socket.emit("create-room", (response) => {
      setIsLoading(false);

      if (response.error) {
        setError(response.message);
        return;
      }

      setRoomCode(response.roomCode);
      setPlayerSymbol(response.playerSymbol);
      setPlayerCount(1);
      setRoomStatus("waiting");
      navigate(`/lobby/${response.roomCode}`);
    });
  }, [navigate]);

  // ─── JOIN ROOM ──────────────────────────────────────
  const joinRoom = useCallback(
    (code) => {
      setIsLoading(true);
      setError(null);

      const normalizedCode = code.trim().toUpperCase();

      socket.emit("join-room", normalizedCode, (response) => {
        setIsLoading(false);

        if (response.error) {
          setError(response.message);
          return;
        }

        setRoomCode(response.roomCode);
        setPlayerSymbol(response.playerSymbol);
        setPlayerCount(2);
        setRoomStatus("ready");
        navigate(`/lobby/${response.roomCode}`);
      });
    },
    [navigate]
  );

  // ─── LEAVE ROOM ─────────────────────────────────────
  const leaveRoom = useCallback(() => {
    setRoomCode(null);
    setPlayerSymbol(null);
    setPlayerCount(0);
    setRoomStatus(null);
    setError(null);
    navigate("/");
  }, [navigate]);

  // ─── CLEAR ERROR ────────────────────────────────────
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ─── SOCKET EVENT LISTENERS ─────────────────────────
  useEffect(() => {
    // When the second player joins (host receives this)
    const onPlayerJoined = (data) => {
      setPlayerCount(data.playerCount);
      setRoomStatus(data.status);
    };

    // When a player leaves the room
    const onPlayerLeft = (data) => {
      setPlayerCount(data.playerCount);
      setRoomStatus(data.status);
    };

    socket.on("player-joined", onPlayerJoined);
    socket.on("player-left", onPlayerLeft);

    return () => {
      socket.off("player-joined", onPlayerJoined);
      socket.off("player-left", onPlayerLeft);
    };
  }, []);

  const value = {
    roomCode,
    playerSymbol,
    playerCount,
    roomStatus,
    error,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    clearError,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

/**
 * Custom hook to access room context.
 * Must be used within a RoomProvider.
 */
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};

export default RoomContext;
