// ============================================
// Component: InteractiveBackground
// Spawns animated X/O symbols on mouse move
// ============================================

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Renders floating X and O symbols that appear at the cursor
 * position as the user moves the mouse anywhere on the page.
 * Uses a document-level listener so it works even when other
 * elements are on top.
 */
const InteractiveBackground = () => {
  const [symbols, setSymbols] = useState([]);
  const lastSpawnTime = useRef(0);
  const idCounter = useRef(0);

  // Throttled mouse move handler — spawns a symbol every 100ms
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastSpawnTime.current < 100) return;
    lastSpawnTime.current = now;

    const id = idCounter.current++;
    const isX = Math.random() > 0.5;
    const size = 18 + Math.random() * 22; // 18–40px
    const drift = (Math.random() - 0.5) * 80; // horizontal drift
    const rotation = (Math.random() - 0.5) * 140; // rotation angle
    const duration = 1400 + Math.random() * 800; // 1.4–2.2s lifetime

    const newSymbol = {
      id,
      x: e.clientX,
      y: e.clientY,
      isX,
      size,
      drift,
      rotation,
      duration,
    };

    setSymbols((prev) => [...prev, newSymbol]);

    // Auto-remove after animation completes
    setTimeout(() => {
      setSymbols((prev) => prev.filter((s) => s.id !== id));
    }, duration);
  }, []);

  // Attach listener to the document so it captures mouse events globally
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {symbols.map((s) => (
        <span
          key={s.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: s.isX
              ? "rgba(75, 85, 99, 0.22)" // soft graphite slate gray
              : "rgba(107, 114, 128, 0.16)",
            textShadow: "none",
            transform: "translate(-50%, -50%)",
            animation: `symbolFloat ${s.duration}ms ease-out forwards`,
            "--drift": `${s.drift}px`,
            "--rotation": `${s.rotation}deg`,
          }}
        >
          {s.isX ? "✕" : "○"}
        </span>
      ))}
    </div>
  );
};

export default InteractiveBackground;
