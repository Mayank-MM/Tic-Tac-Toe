import { useRoom } from "../contexts/RoomContext";

/**
 * Visual countdown component that displays before the game starts.
 * Shown as a large overlay within the lobby.
 */
const Countdown = () => {
  const { countdown } = useRoom();

  if (!countdown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4 tracking-widest uppercase opacity-80">
          Game Starting In
        </h2>
        {/* The countdown number with a pop/scale animation */}
        <div className="relative">
          <div
            key={countdown} // Key forces re-render/re-animation on number change
            className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50
                       animate-pop-in drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            {countdown}
          </div>
          
          {/* Decorative rings behind the number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/10 animate-ping" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-full border border-white/20" />
        </div>
      </div>
    </div>
  );
};

export default Countdown;
