import type { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useEffect, useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { Piece, ChessPieceDragLayer } from "./Piece";
import { HTML5Backend } from "react-dnd-html5-backend";

type piece = {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

interface DraggablePieceItem {
  id: string; // Or Square
  type: PieceSymbol;
  color: Color;
  fromSquare: Square;
}

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
  const dropTargetImgRef = useRef<HTMLImageElement>(null);



  const getNotation = (row: number, col: number) => {
    if (side === "black") {
      return String.fromCharCode(97 + (7 - col)) + (8 - (7 - row));
    }
    return String.fromCharCode(97 + col) + (8 - row);
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

  const isLegalSquare = (targetSquare: Square): boolean => {
    if (!legal) return false;
    return legal.some(move => move.to === targetSquare);
  };

  const isLegalCaptureOnSquare = (targetSquare: Square): boolean => {
    if (!legal) return false;
    return legal.some(move => move.to === targetSquare && move.captured);
  };

  const renderSquare = (square: piece | null, rowIndex: number, squareIndex: number) => {
    const targetNotation = getNotation(rowIndex, squareIndex);

    const [{ isOver, canDrop: canDropSquare }, dropRef] = useDrop(() => ({
      accept: "piece",
      drop: (item: DraggablePieceItem) => {
        const fromSq = item.fromSquare;
        const toSq = targetNotation;

        // Check for legality again on drop, though canDrop should handle it
        const currentLegalMoves = chess.moves({ square: fromSq as Square, verbose: true });
        const isMoveAllowed = currentLegalMoves.some(m => m.to === toSq);

        if (isMoveAllowed) {
          const moveData = JSON.stringify({
            type: "move",
            move: {
              from: fromSq,
              to: toSq
            }
          });
          socket.send(moveData);
          console.log(`Dragged From = ${fromSq} - To = ${toSq}`);
          setFrom(null); // Clear selection after move
          setLegal([]);  // Clear legal moves
        } else {
          console.log(`Illegal drop: ${fromSq} to ${toSq}`);
        }
      },
      canDrop: (item: DraggablePieceItem) => {
        if (!chess || item.color !== chess.turn()) { // Ensure it's the current player's piece
          return false;
        }
        const legalMovesForPiece = chess.moves({ square: item.fromSquare as Square, verbose: true });
        return legalMovesForPiece.some(move => move.to === targetNotation);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(), // This reflects the output of our canDrop function
      }),
    }), [chess, side, rowIndex, squareIndex]); // Dependencies for useDrop




    const squareColor = (rowIndex + squareIndex) % 2 === 0 ? "bg-[#739552]" : "bg-[#ccccbc]";
    // Visual feedback for drop target
    const dropTargetStyle = isOver && canDropSquare ? "bg-yellow-400" : (canDropSquare && !isOver ? "bg-blue-300 opacity-50" : "");


    return (
      <div
        ref={dropRef as unknown as React.Ref<HTMLDivElement>} // Attach the drop ref to the square
        onClick={() => {
          console.log("Clicked on:", targetNotation);
          if (!from && square && square.color === chess.turn() && square.color === side.charAt(0)) { // Only allow selecting own pieces on own turn
            setFrom(square.square.toString());
          } else if (from && isLegalSquare(targetNotation as Square)) { // If a piece is selected and the target is legal (for click-move)
            const moveData = JSON.stringify({
              type: "move",
              move: {
                from,
                to: targetNotation
              }
            });
            socket.send(moveData);
            console.log(`Clicked From = ${from} - To = ${targetNotation}`);
            setFrom(null);
            setLegal([]);
          } else if (from && square?.square === from) { // Deselect if clicking the same piece
            setFrom(null);
            setLegal([]);
          }
        }}
        key={squareIndex}
        className={`w-20 h-20 relative flex items-center justify-center ${squareColor} ${dropTargetStyle}`}
      >
        {square && <Piece square={square} />}
        {!square && isLegalSquare(targetNotation as Square) && !isLegalCaptureOnSquare(targetNotation as Square) &&
          <div className="w-4 h-4 rounded-full bg-[#797672] bg-opacity-70"></div>
        }
        {square && square.color !== chess.turn() && isLegalCaptureOnSquare(targetNotation as Square) &&
          <div className="absolute inset-1 border-4 border-red-700 rounded-full opacity-60 pointer-events-none"></div>
        }
        {/* Highlight for potential drop square */}
        {/* {isOver && canDropSquare && <div className="absolute inset-0 bg-green-500 opacity-30 pointer-events-none"></div>}
        {!isOver && canDropSquare && <div className="absolute inset-0 bg-blue-500 opacity-30 pointer-events-none"></div>} */}
      </div>
    );
  };

  return <>
    <div className="text-white">
      {side === "black" ?
        [...board].reverse().map((rowSquares, visualRowIndex) => (
          <div key={visualRowIndex} className="flex">
            {[...rowSquares].reverse().map((sq, visualSquareIndex) =>
              renderSquare(sq, visualRowIndex, visualSquareIndex)
            )}
          </div>
        )) :
        board.map((rowSquares, visualRowIndex) => (
          <div key={visualRowIndex} className="flex">
            {rowSquares.map((sq, visualSquareIndex) =>
              renderSquare(sq, visualRowIndex, visualSquareIndex)
            )}
          </div>
        ))}
    </div>
    <ChessPieceDragLayer />
  </>
}
