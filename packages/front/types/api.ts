import { Player } from "models/player";
import { GamePayload } from "transports/game.transport";

export type APIGetGame = {
  game: GamePayload;
  players: Record<string, Player>;
};
