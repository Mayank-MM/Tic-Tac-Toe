// ============================================
// App.jsx — Root Application Component
// Configures React Router, contexts, and pages
// ============================================

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { RoomProvider } from "./contexts/RoomContext";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import InteractiveBackground from "./components/InteractiveBackground";

/**
 * Animated routes subcomponent to capture page location
 * and orchestrate page exit/entrance transitions.
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
        <Route path="/room/:roomCode/game" element={<Game />} />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Root component: wraps the app in BrowserRouter + RoomProvider
 * and renders all routing components.
 */
const App = () => {
  return (
    <BrowserRouter>
      <RoomProvider>
        {/* Interactive X/O background — visible on all pages */}
        <InteractiveBackground />
        <AnimatedRoutes />
      </RoomProvider>
    </BrowserRouter>
  );
};

export default App;
