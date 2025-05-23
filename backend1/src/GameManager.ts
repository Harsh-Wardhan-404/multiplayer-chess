import WebSocket from "ws";
import { INIT_GAME, MOVE, RESIGN } from "./messages";
import { Game } from "./Game";

//Make a users class , currently just keeping it as ws

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter(user => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {

        console.log("Game start request received");
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          console.log("New game started as both players are ready");
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        console.log("Move req received");
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
        if (game) {
          console.log("game found");
          game.makeMove(socket, message.move);
        }
      }

      if (message.type === RESIGN) {
        console.log("Resign req received");
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
        if (game) {
          game.resign(socket);
        }
      }
    })
  }
}