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
- Interactive X/O background effect

⬜ **Phase 2** — Room Management (Coming Soon)

## License

ISC
