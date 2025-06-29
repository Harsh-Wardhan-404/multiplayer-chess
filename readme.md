# Multiplayer Chess

A real-time multiplayer chess game built with React, Node.js, and WebSockets. This project features a unique "Joker" piece for an extra layer of strategy and fun.

![Chessboard Screenshot](frontend/public/chessboard.png)

## Features

- Real-time multiplayer gameplay
- Classic chess rules and logic
- **Joker Piece**: A special piece that can move like any other piece for a single move. Its ability changes on each move, cycling through Pawn, Knight, Bishop, Rook, and Queen.
- Move validation on both client and server
- Drag-and-drop piece movement
- Win/loss detection and celebration confetti!

## Tech Stack

**Frontend:**

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React DnD for drag and drop
- chess.js for client-side logic

**Backend:**

- Node.js
- TypeScript
- WebSockets (`ws`)
- chess.js for server-side game logic

## Local Development

To run this project locally, you'll need to run both the frontend and backend servers.

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Backend Setup

1.  Navigate to the `backend1` directory:
    ```bash
    cd backend1
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The backend WebSocket server will be running on `ws://localhost:8080`.

### Frontend Setup

1.  In a new terminal, navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

4.  Open your browser and navigate to the address to play!

