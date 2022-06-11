import { getRandomRoomCode } from "helpers/getRandomRoomCode";
import { redis } from "lib/redis";
import { GameState, isGameState } from "types";

export const createGame = async () => {
  const id = getRandomRoomCode();
  await redis.multi().set(`${id}:status`, "WAITING").sadd(`games`, id).exec();
  return id;
};

export type GamePayload = {
  id: string;
  status: GameState;
  currentPlayer: string;
  nextPlayer: string;
  players: string[];
  order: string[];
};

export const getGame = async (id: string): Promise<GamePayload> => {
  const gameState = await redis
    .multi()
    .get(`${id}:status`)
    .get(`${id}:order`)
    .get(`${id}:currentPlayer`)
    .get(`${id}:nextPlayer`)
    .smembers(`${id}:players`)
    .exec();

  if (!gameState) {
    throw new Error("Game not found");
  }

  const [
    [, status],
    [, order],
    [, currentPlayer],
    [, nextPlayer],
    [, players],
  ] = gameState;

  return {
    id,
    status: isGameState(status) ? status : "WAITING",
    currentPlayer: typeof currentPlayer === "string" ? currentPlayer : "",
    nextPlayer: typeof nextPlayer === "string" ? nextPlayer : "",
    players: Array.isArray(players) ? players.map(String) : [],
    order: order ? String(order).split(",") : [],
  };
};

export const setGameOrder = async (gameId: string, order: string[]) => {
  const status = await redis.get(`${gameId}:status`);
  if (status !== "WAITING") {
    throw new Error("Game is already started or finished");
  }

  await redis.set(`${gameId}:order`, order.join(","));
};
