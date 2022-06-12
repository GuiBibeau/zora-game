import { getRandomRoomCode } from "helpers/getRandomRoomCode";
import { redis } from "lib/redis";
import { GameState, isGameState } from "types";

export const createGame = async () => {
  const id = getRandomRoomCode();
  await redis
    .multi()
    .hset(`${id}`, {
      id,
      status: "WAITING",
      currentPlayer: "",
      currentTurn: 0,
      nextPlayer: "",
    })
    .sadd(`games`, id)
    .exec();
  return id;
};

export type GamePayload = {
  id: string;
  status: GameState;
  currentPlayer: string;
  currentTurn: number;
  nextPlayer: string;
  players: string[];
  order: string[];
};

export const getGame = async (id: string): Promise<GamePayload> => {
  const game = await redis.hgetall(`${id}`);
  const players = await redis.smembers(`${id}:players`);
  const order = await redis.lrange(`${id}:order`, 0, -1);

  if (!game) {
    throw new Error("Game not found");
  }

  return {
    ...game,
    players,
    order,
  } as GamePayload;
};

export const getPositions = async (gameId: string) => {
  const positions = await redis.hgetall(`${gameId}:positions`);
  if (!positions) {
    throw new Error("Game not found");
  }
  return positions;
};

export const startGame = async (gameId: string) => {
  const status = await redis.hget(gameId, "status");
  // check if the game is already started or ended
  if (status !== "WAITING") {
    throw new Error("Game is already started or finished");
  }
  console.log("hello");

  // check if the game has at least two players
  const players = await redis.smembers(`${gameId}:players`);
  if (players.length < 2) {
    throw new Error("Game must have at least two players");
  }

  // get all the players and shuffle them into an order saved as a list
  const order = players.sort(() => Math.random() - 0.5);

  // set the first player as the current player and the second player as the next player
  if (!order) {
    throw new Error("Game must have an order");
  }
  const [currentPlayer, nextPlayer] = order;
  await redis
    .multi()
    .hset(`${gameId}`, "status", "PLAYING")
    .rpush(`${gameId}:order`, ...order)
    .hset(`${gameId}`, "currentPlayer", currentPlayer)
    .hset(`${gameId}`, "nextPlayer", nextPlayer)
    .exec();
};
