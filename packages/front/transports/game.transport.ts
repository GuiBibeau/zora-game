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

export const nextPlayer = async (gameId: string) => {
  // get the current player
  const currentPlayer = await redis.hget(gameId, "currentPlayer");
  // get the next player
  const nextPlayer = await redis.hget(gameId, "nextPlayer");
  // get the order of the players
  const order = await redis.lrange(`${gameId}:order`, 0, -1);
  // get the index of the current player in the order
  const nextPlayerIndex = order.indexOf(nextPlayer!);
  //from the order set the current and next player
  const newCurrentPlayer = nextPlayer;
  const newNextPlayer =
    nextPlayerIndex === order.length - 1
      ? order[0]
      : order[nextPlayerIndex + 1];

  console.log(newCurrentPlayer, newNextPlayer);

  // update the current player and next player in the database
  await redis
    .multi()
    .hset(`${gameId}`, "currentPlayer", newCurrentPlayer!)
    .hset(`${gameId}`, "nextPlayer", newNextPlayer)
    // current player's turn is over so he gets one more actionPoint
    .hincrby(`${gameId}:players:${currentPlayer}`, "actionPoints", 1)
    .exec();
};
