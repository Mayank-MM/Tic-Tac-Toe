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
 * State: roomCode, playerSymbol, playerCount, roomStatus, error, isRoomReady, countdown
 * Actions: createRoom, joinRoom, leaveRoom
 */
export const RoomProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [roomStatus, setRoomStatus] = useState(null); // waiting | ready | playing
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Phase 3 states
  const [isRoomReady, setIsRoomReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

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
      setIsRoomReady(false);
      setCountdown(null);
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
        setIsRoomReady(false);
        setCountdown(null);
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
    setIsRoomReady(false);
    setCountdown(null);
    setError(null);
    navigate("/");
  }, [navigate]);

  // ─── CLEAR ERROR ────────────────────────────────────
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ─── SOCKET EVENT LISTENERS ─────────────────────────
  useEffect(() => {
    // General room update (e.g. from joining or leaving)
    const onRoomUpdated = (data) => {
      setPlayerCount(data.playerCount);
      setRoomStatus(data.status);
    };

    // When a player leaves the room
    const onPlayerLeft = (data) => {
      setPlayerCount(data.playerCount);
      setRoomStatus(data.status);
      setIsRoomReady(false);
      setCountdown(null);
    };

    // When countdown ticks
    const onStartCountdown = (count) => {
      setCountdown(count);
    };

    // When countdown finishes
    const onStartGame = () => {
      setCountdown(null);
      setIsRoomReady(true);
    };

    // Old events (for backwards compatibility during transition, can be removed if not emitted anymore)
    socket.on("player-joined", onRoomUpdated); // we map this to onRoomUpdated just in case
    
    // Phase 3 events
    socket.on("room-updated", onRoomUpdated);
    socket.on("player-left", onPlayerLeft);
    socket.on("start-countdown", onStartCountdown);
    socket.on("start-game", onStartGame);

    return () => {
      socket.off("player-joined", onRoomUpdated);
      socket.off("room-updated", onRoomUpdated);
      socket.off("player-left", onPlayerLeft);
      socket.off("start-countdown", onStartCountdown);
      socket.off("start-game", onStartGame);
    };
  }, []);

  const value = {
    roomCode,
    playerSymbol,
    playerCount,
    roomStatus,
    error,
    isLoading,
    isRoomReady,
    countdown,
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
