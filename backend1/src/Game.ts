import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: "white"
      }
    }))

    this.player2.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: "black"
      }
    }))
  }

  makeMove(socket: WebSocket, move: {
    from: string;
    to: string;
  }) {
    console.log("Moves array: ", this.board.history());
    // validate the type of move using zod
    if (this.board.history().length % 2 === 0 && socket !== this.player1) {
      console.log("Returning from first");
      return;
    }
    if (this.board.history().length % 2 !== 0 && socket !== this.player2) {
      console.log("Returning from second");
      return;
    }
    try {
      console.log("Move received: ", move);
      this.board.move(move)
      if (this.board.isGameOver()) {
        const gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            move: move,
            winner: this.board.turn() === "w" ? "black" : "white"
          }
        })
        this.player1.send(gameOverMessage)
        this.player2.send(gameOverMessage)
        return;
      }
      console.log(`Move: ${move}`);

      const moveMessage = JSON.stringify({
        type: MOVE,
        payload: {
          move: move,
          madeBy: socket === this.player1 ? "white" : "black"
        }
      })
      this.player1.send(moveMessage);
      this.player2.send(moveMessage);
    } catch (e) {
      console.log(e);
      return;
    }

  }



}