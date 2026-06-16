import { useRoom } from "../contexts/RoomContext";

const GameHeader = () => {
  const { roomCode } = useRoom();

  return (
    <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-400/30 pb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span className="text-gray-500 text-sm uppercase tracking-widest font-normal">Room</span>
        <span className="font-mono tracking-widest">{roomCode}</span>
      </h2>
      <div className="text-gray-500 text-sm font-medium italic">Tic-Tac-Toe</div>
    </div>
  );
};

export default GameHeader;
