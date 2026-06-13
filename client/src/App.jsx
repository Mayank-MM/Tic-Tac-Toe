// ============================================
// App.jsx — Root Application Component
// Configures React Router and renders pages
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InteractiveBackground from "./components/InteractiveBackground";

/**
 * Root component: wraps the app in BrowserRouter
 * and defines all route → page mappings.
 * Phase 2 will add: /lobby, /game/:roomId, etc.
 */
const App = () => {
  return (
    <BrowserRouter>
      {/* Interactive X/O background — visible on all pages */}
      <InteractiveBackground />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
