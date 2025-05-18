import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, RESIGN } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private gameId: string;
  private isGameOver: boolean;

  constructor(player1: WebSocket, player2: WebSocket, gameId?: string) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.gameId = gameId || Math.random().toString(36).substring(2, 15);
    this.isGameOver = false;
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

  public resign(resigningPlayerSocket: WebSocket) {
    if (this.isGameOver) {
      console.log(`Game ${this.gameId} is already over. Resignation ignored.`);
      // Optionally, send a message back to the resigning player
      resigningPlayerSocket.send(JSON.stringify({
        type: "error",
        message: "Game is already over."
      }));
      return;
    }

    let winnerColor: "white" | "black";
    let resignedPlayerColor: "white" | "black";

    if (resigningPlayerSocket === this.player1) {
      // Player 1 (assumed white) resigns, Player 2 (black) wins
      winnerColor = "black";
      resignedPlayerColor = "white";
      console.log(`Game ${this.gameId}: Player 1 (white) resigned. Player 2 (black) wins.`);
    } else if (resigningPlayerSocket === this.player2) {
      // Player 2 (assumed black) resigns, Player 1 (white) wins
      winnerColor = "white";
      resignedPlayerColor = "black";
      console.log(`Game ${this.gameId}: Player 2 (black) resigned. Player 1 (white) wins.`);
    } else {
      // This case should ideally not happen if GameManager finds the correct game
      console.error(`Game ${this.gameId}: Resigning player is not part of this game.`);
      return;
    }

    this.isGameOver = true;

    const gameOverPayload = {
      winner: winnerColor,
      reason: "resignation",
      resignedBy: resignedPlayerColor // Send which color resigned
    };

    // Notify both players about the game outcome
    this.player1.send(JSON.stringify({
      type: RESIGN,
      payload: gameOverPayload
    }));

    this.player2.send(JSON.stringify({
      type: RESIGN,
      payload: gameOverPayload
    }));

    console.log(`Game ${this.gameId} concluded due to resignation. Winner: ${winnerColor}.`);
  }


}