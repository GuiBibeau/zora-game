import { GamePayload } from "transports/game.transport";
import { Coordinate, Player } from "./game";

export type APIGetGame = {
  game: GamePayload;
  players: Record<string, Player>;
  positions: Record<Coordinate, string>;
};
