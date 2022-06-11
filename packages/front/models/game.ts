import { DEFAULT_MAX_PLAYERS } from "../constants";
import { GameState, Turn } from "types";
import { Board } from "./board";
import { Player } from "./player";

export class Game {
  id: string;
  turns: Turn[] = [];

  order: string[] = [];

  status: GameState = "WAITING";

  board: Board;

  players: Record<string, Player> = {};

  currentPlayer: string = "";

  nextPlayer: string = "";

  constructor({
    playersOrder,
    id,
    turns,
    players,
    status,
  }: {
    playersOrder: string[];
    id: string;
    turns?: Turn[];
    players?: Record<string, Player>;
    status: GameState;
  }) {
    // hydrate the state of the game
    this.board = new Board();

    this.id = id;

    this.turns = turns ?? [];

    this.order = playersOrder;

    this.status = status;

    if (players) {
      this.players = players;
    } else {
      this.players = playersOrder.reduce(
        (acc, playerId) => ({
          ...acc,
          [playerId]: new Player(playerId, this.board.randomFreeCoordinate),
        }),
        {}
      );
    }
  }

  // TODO: change to contract:tokenId when connected to Zora
  addPlayer = (id: string) => {
    if (Object.keys(this.players).length >= DEFAULT_MAX_PLAYERS) {
      throw new Error("Game is full");
    }
    this.players[id] = new Player(id, this.board.randomFreeCoordinate);

    // add playerId to the order and shuffle it
    this.order.push(id);
    this.order = this.order.sort(() => Math.random() - 0.5);

    return { player: this.players[id], order: this.order };
  };

  private savePlayers() {}
}

// 1 class creates a player
// 2 save player in redis
// 3 save game in redis
// hydrate the state of the game
