/**
 * PresenceIndicator: Renders a visual tag reflecting online status.
 *
 * Status levels:
 *  - 'online'       → 🟢 Opponent Online
 *  - 'disconnected' → 🔴 Opponent Disconnected
 *  - 'reconnecting' → 🟡 Reconnecting...
 */
const PresenceIndicator = ({ status = "online", className = "" }) => {
  const statusConfig = {
    online: {
      color: "bg-emerald-500",
      text: "Opponent Online",
      textColor: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      ping: true,
    },
    disconnected: {
      color: "bg-red-500",
      text: "Opponent Disconnected",
      textColor: "text-red-700",
      bg: "bg-red-50 border-red-200",
      ping: false,
    },
    reconnecting: {
      color: "bg-amber-500",
      text: "Reconnecting...",
      textColor: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      ping: true,
    },
  };

  const config = statusConfig[status] || statusConfig.online;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide shadow-sm ${config.bg} ${config.textColor} ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {config.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              status === "online" ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`} />
      </span>
      <span className="font-sans">{config.text}</span>
    </div>
  );
};

export default PresenceIndicator;
