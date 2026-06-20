# 🎮 Multiplayer Tic-Tac-Toe

Real-time multiplayer Tic-Tac-Toe web application built with React, Express, and Socket.IO.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Vite, Tailwind CSS v4, React Router |
| Backend    | Node.js, Express.js, Socket.IO    |
| Real-time  | Socket.IO Client ↔ Server        |

## Project Structure

```
tic-tac-toe/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page-level components
│       ├── hooks/        # Custom React hooks
│       ├── socket/       # Socket.IO client
│       ├── contexts/     # React Contexts (Phase 2)
│       ├── services/     # Service modules (Phase 2)
│       └── utils/        # Helpers & constants
└── server/          # Express + Socket.IO backend
    ├── config/      # Environment config
    ├── socket/      # Socket event handlers
    └── utils/       # Logger & utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Environment Variables

Copy the example files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Running

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Current Status

✅ **Phase 1 — Foundation Setup** (Complete)
- React + Vite + Tailwind CSS frontend
- Express + Socket.IO backend
- Real-time connection status indicator
- Interactive X/O background effect (Yellow & White Theme)

✅ **Phase 2 — Room Management** (Complete)
- Generate unique 6-character room codes
- Create and Join room functionality
- Room state tracked in memory using Javascript Maps
- Home page UI with clear Call-to-Action buttons

✅ **Phase 3 — Lobby Synchronization** (Complete)
- Multiplayer lobby UI with synchronized room state
- Animated 3..2..1 game start countdown
- Real-time Player Join / Disconnect handling
- Seamless transition to Game Page placeholder

✅ **Phase 4 — Game Entry & Board UI** (Complete)
- Immersive Framer Motion paper-unfold transition
- Hand-drawn pencil aesthetic for game board and cells
- GameContext state setup for board initialization

✅ **Phase 5 — Gameplay & Turn Synchronization** (Complete)
- Real-time move synchronization via Socket.IO
- Authoritative server-side validation & turn management
- Immersive placement animation & toast error handling
- Opponent disconnect handling & board locking

✅ **Phase 6 — Winner Detection, Draw Logic, & Game Over Flow** (Complete)
- Authoritative server-side win and draw calculation post-move
- Dynamic red pencil stroke winning line animation spanning exactly 600ms
- Soft-glow highlights and yellow highlighter sketch overlays on winning cells
- Paper container shake animation upon reaching draw outcomes
- Memo-pad styled Game Over modal showcasing scorecards and room exits

✅ **Phase 7 — 10-Second Turn Timer** (Complete)
- Server-authoritative 10-second turn timer tracking per active player
- Turn passed to the other player on turn timeouts to prevent game stagnation
- Visual Framer Motion linear progress bar matching the notebook theme
- Pulsing red countdown indicator badge warning when time is low (<= 3s)
- Automated interval clearings on moves, wins/draws, disconnects, and exits

✅ **Phase 8 — Multiplayer Rematch System** (Complete)
- Both-player-accept rematch flow without leaving the room
- Server tracks rematch requests via a Set; starts new round when both accept
- Board reset, symbol re-randomization, and turn timer restart on rematch
- "Play Again" button transitions to pulsing "Waiting for opponent…" indicator
- Scores persist across rematches; rematch state clears on opponent disconnect

## License

ISC
