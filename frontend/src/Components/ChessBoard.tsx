import type { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import bN from '../assets/bN.svg';
import bK from '../assets/bK.svg';
import bP from '../assets/bP.svg';
import bR from '../assets/bR.svg';
import bQ from '../assets/bQ.svg';
import bB from '../assets/bB.svg';
import wN from '../assets/wN.svg';
import wK from '../assets/wK.svg';
import wP from '../assets/wP.svg';
import wR from '../assets/wR.svg';
import wQ from '../assets/wQ.svg';
import wB from '../assets/wB.svg';


export const ChessBoard = ({ board, socket, side, chess }: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  side: string;
  chess: Chess;
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [legal, setLegal] = useState<Move[] | null>([]);


  const getNotation = (row: number, col: number) => {
    if (side === "black") {
      return String.fromCharCode(97 + (7 - col)) + (8 - (7 - row));
    }
    return String.fromCharCode(97 + col) + (8 - row);
  }
  const getPieceImage = (piece: any) => {
    const color = piece?.color;
    switch (piece.type) {
      case "n": return color === "w" ? wN : bN

      case "k": return color === "w" ? wK : bK
      case "p": return color === "w" ? wP : bP
      case "r": return color === "w" ? wR : bR
      case "q": return color === "w" ? wQ : bQ
      case "b": return color === "w" ? wB : bB
      default: return ""
    }
  }

  useEffect(() => {
    console.log(`ChessBoard useEffect - Side: ${side}, From: ${from}`);
    console.log('Current FEN:', chess.fen());
    console.log('Whose turn:', chess.turn());
    if (from !== null) {
      console.log('Piece at "from" square:', JSON.stringify(chess.get(from as Square)));
      const calculatedMoves = chess.moves({ verbose: true, square: from as Square });
      // const updatedMoves = calculatedMoves.map(move => move.slice(-2));
      console.log(`Moves calculated by chess.js for ${from}:`, JSON.stringify(calculatedMoves));
      setLegal(calculatedMoves);
    } else {
      setLegal([]);
    }
  }, [from, chess])

  const isLegal = (row: number, col: number) => {
    if (!legal) return false;
    const target = getNotation(row, col);
    return legal.some(move => move.to === target);
  }

  const isLegalCaptureTarget = (row: number, col: number) => {
    if (!legal) return false;
    const target = getNotation(row, col);
    return legal.some(move => move.to === target && move.captured);
  }

  return <>

    <div className="text-white">
      {side === "black" ?
        [...board].reverse().map((row, rowIndex) => {
          return <div key={rowIndex} className="flex">
            {[...row].reverse().map((square, squareIndex) => {
              const squareColor = (rowIndex + squareIndex) % 2 === 0 ? "bg-[#739552]" : "bg-[#ccccbc]";
              const pieceColor = square?.color === "w" ? "text-red" : "text-black";

              return <div onClick={() => {
                console.log(getNotation(rowIndex, squareIndex));
                if (!from) {
                  setFrom(square?.square?.toString() ?? null)
                  // let moves = chess.moves({ square: square?.square, verbose: false });
                  // setLegal(moves);
                  console.log(("legal moves: " + legal));
                } else {
                  let toRaw = getNotation(rowIndex, squareIndex);
                  setTo(toRaw);
                  const moveData = JSON.stringify({
                    type: "move",
                    move: {
                      from,
                      to: toRaw
                    }
                  })
                  socket.send(moveData)
                  console.log(`From = ${from} - To = ${toRaw}`);
                  setFrom(null);
                  setLegal([]);
                }
              }} key={squareIndex} className={`w-20 h-20 relative flex items-center justify-center ${squareColor} ${pieceColor}`}>
                {square ? <img src={getPieceImage(square)} className="w-full h-full" alt="" /> : ""}
                {!square && isLegal(rowIndex, squareIndex) && !isLegalCaptureTarget(rowIndex, squareIndex) && // Ensure it's not a capture target
                  <div className="w-4 h-4 rounded-full bg-[#797672] bg-opacity-70"></div>
                }
                {square && square.color !== chess.turn() && isLegalCaptureTarget(rowIndex, squareIndex) &&
                  <div className="absolute inset-0 border-4 border-red-500 rounded-full opacity-40 pointer-events-none"></div>
                }
              </div>;
            })}
          </div>
        }) : board.map((row, rowIndex) => {
          return <div key={rowIndex} className="flex">
            {row.map((square, squareIndex) => {
              const squareColor = (rowIndex + squareIndex) % 2 === 0 ? "bg-[#739552]" : "bg-[#ccccbc]";
              const pieceColor = square?.color === "w" ? "text-red" : "text-black";

              return <div onClick={() => {
                console.log(getNotation(rowIndex, squareIndex));
                if (!from) {
                  setFrom(square?.square.toString() ?? null)
                  let moves = chess.moves({ square: square?.square, verbose: true });
                  setLegal(moves);
                  console.log(("legal moves: " + moves));
                } else {
                  let toRaw = getNotation(rowIndex, squareIndex);
                  setTo(toRaw);
                  const moveData = JSON.stringify({
                    type: "move",
                    move: {
                      from,
                      to: toRaw
                    }
                  })
                  socket.send(moveData)
                  console.log(`From = ${from} - To = ${toRaw}`);
                  setFrom(null);
                }
              }} key={squareIndex} className={`w-20 h-20 relative flex items-center justify-center ${squareColor} ${pieceColor}`}>{square ? <img src={getPieceImage(square)} className="w-full h-full" alt="" /> : ""}
                {!square && isLegal(rowIndex, squareIndex) && !isLegalCaptureTarget(rowIndex, squareIndex) && // Ensure it's not a capture target
                  <div className="w-4 h-4 rounded-full bg-[#797672] bg-opacity-70"></div>
                }
                {square && square.color !== chess.turn() && isLegalCaptureTarget(rowIndex, squareIndex) &&
                  <div className="absolute inset-0 border-4 border-red-500 rounded-full opacity-40 pointer-events-none"></div>
                }
              </div>;
            })}
          </div>
        })}

      {/* {side === "black" && } */}
    </div>
  </>
}
