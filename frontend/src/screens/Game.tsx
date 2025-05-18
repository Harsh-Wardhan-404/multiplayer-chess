import { useEffect, useState, useRef } from "react";
import { Button } from "../Components/Button"
import { ChessBoard } from "../Components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";


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
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Color: ", message.payload.color);
          setSide(message.payload.color)
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
          console.log("Game over");
          break;
      }

    }
  }, [socket])

  useEffect(() => {
    chessRef.current = chess;
    setBoard(chessRef.current.board());
  }, [chess])


  if (!socket) return <div>Loading...</div>;
  return <div>
    <div className=" p-4 ml-20 grid grid-cols-3 gap-2 justify-center items-center ">
      <div className="col-span-2 mt-4 "><ChessBoard chess={chess} side={side} board={board} socket={socket} /></div>
      <div className="flex flex-col gap-5 ">
        <div>
          <Button variant="success" onClick={() => {
            socket.send(JSON.stringify({
              type: INIT_GAME
            }))
          }}  >Play</Button>
        </div>
        <div>
          <Button variant="danger" onClick={() => {
            socket.send(JSON.stringify({
              type: RESIGN
            }))
          }}>Resign</Button>
        </div>
      </div>
    </div>

  </div>

}