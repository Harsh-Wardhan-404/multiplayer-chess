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
import type { Color, PieceSymbol, Square } from 'chess.js';
import { useDrag, useDragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffect } from 'react';

type piece = {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export const Piece = ({ square: pieceData }: {
  square: piece
}) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "piece",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: () => ({
        id: pieceData.square,
        type: pieceData.type,
        color: pieceData.color,
        fromSquare: pieceData.square
      })
    }),
    [pieceData],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

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

  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          height: '100%',
          width: '100%',
        }}
        src={getPieceImage(pieceData)}
        className="w-full h-full"
        alt=""
      />
    </div>
  );
}

export const ChessPieceDragLayer = () => {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item || !currentOffset) return null;

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
  };

  const style = {
    position: 'fixed' as const,
    pointerEvents: 'none' as const,
    left: currentOffset.x,
    top: currentOffset.y,
    width: 80,
    height: 80,
    zIndex: 100,
    willChange: 'transform',
  };

  return (
    <div style={style}>
      <img
        src={getPieceImage(item)}
        style={{ width: '100%', height: '100%' }}
        alt=""
      />
    </div>
  );
};