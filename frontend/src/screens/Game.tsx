import { useEffect, useState, useRef } from "react";
import { Button } from "../Components/Button"
import { ChessBoard } from "../Components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";
import { ConfettiEffect } from "../Components/Confetti";
import { Card } from "../Components/Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const RESIGN = "resign";

export const Game = () => {
  const socket = useSocket();
  const chessRef = useRef(new Chess());
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [side, setSide] = useState("white");
  const [winner, setWinner] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isResigned, setIsResigned] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Color: ", message.payload.color);
          setSide(message.payload.color);
          setWinner(""); // Reset winner when starting a new game
          setShowConfetti(false); // Reset confetti when starting a new game
          setIsResigned(false); // Reset resignation state
          console.log("Game init");
          break;

        case MOVE:
          // Extract the move correctly from the nested payload
          const move = message.payload.move;
          // Create a new chess instance with current game state
          const newChess = new Chess(chessRef.current.fen());
          // Apply the move
          newChess.move(move);
          // Update state
          setChess(newChess);
          console.log("Move made", move);
          break;

        case GAME_OVER:
          const lastMove = message.payload.move;
          // Create a new chess instance with current game state
          const lastChess = new Chess(chessRef.current.fen());
          // Apply the move
          lastChess.move(lastMove);
          // Update state
          setChess(lastChess);
          setWinner(message.payload.winner);
          console.log("Game over");
          break;

        case RESIGN:
          console.log("Opponent resigned");
          setWinner(message.payload.winner);
          break;
      }
    }
  }, [socket])

  useEffect(() => {
    chessRef.current = chess;
    setBoard(chessRef.current.board());
  }, [chess])

  useEffect(() => {
    setShowConfetti(true);
  }, [winner])

  const handleResign = () => {
    console.log("Resigning");
    if (!winner) {
      // If the current player resigns, the opponent wins
      const oppositeColor = side === "white" ? "black" : "white";
      setWinner(oppositeColor);
      setIsResigned(true);

      // Notify server about resignation if needed (for multiplayer games)
      if (socket) {
        socket.send(JSON.stringify({
          type: RESIGN,
          payload: {
            player: side
          }
        }));
      }
    }
  };

  const handlePlayAgain = () => {
    if (socket) {
      socket.send(JSON.stringify({
        type: INIT_GAME
      }));
    }
  };

  if (!socket) return <div>Loading...</div>;
  return <>


    <DndProvider backend={HTML5Backend}>
      <div>
        {showConfetti && side === winner && <ConfettiEffect />}
        {(winner || isResigned) && <Card message={side === winner ? "You Won !" : "You Lost"} />}
        <div className=" p-4 ml-20 grid grid-cols-3 gap-2 justify-center items-center ">
          <div className="col-span-2 mt-4 "><ChessBoard chess={chess} side={side} board={board} socket={socket} /></div>
          <div className="flex flex-col gap-5 ">
            <div>
              <Button variant="success" onClick={handlePlayAgain}>Play</Button>
            </div>
            <div>
              <Button variant="danger" onClick={handleResign} disabled={!!winner || isResigned}>Resign</Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>

  </>
}