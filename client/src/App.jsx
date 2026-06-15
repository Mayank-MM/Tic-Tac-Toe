// ============================================
// App.jsx — Root Application Component
// Configures React Router, contexts, and pages
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoomProvider } from "./contexts/RoomContext";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import InteractiveBackground from "./components/InteractiveBackground";

/**
 * Root component: wraps the app in BrowserRouter + RoomProvider
 * and defines all route → page mappings.
 */
const App = () => {
  return (
    <BrowserRouter>
      <RoomProvider>
        {/* Interactive X/O background — visible on all pages */}
        <InteractiveBackground />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
          <Route path="/room/:roomCode/game" element={<Game />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  );
};

export default App;
