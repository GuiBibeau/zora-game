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
  let nextPlayerIndex = order.indexOf(nextPlayer!);

  //from the order set the current and next player
  const newCurrentPlayer = nextPlayer;
  let newNextPlayer =
    nextPlayerIndex === order.length - 1
      ? order[0]
      : order[nextPlayerIndex + 1];

  // verify if the next player still has lives
  let newNextPlayerLives = await redis.hget(
    `${gameId}:players:${newNextPlayer}`,
    "lives"
  );

  const playerWithLives = await Promise.all(
    order.map(async (player) => {
      const lives = await redis.hget(`${gameId}:players:${player}`, "lives");
      return {
        player,
        lives,
      };
    })
  );

  // check if only one player has lives
  if (playerWithLives.filter((p) => p.lives !== "0").length === 1) {
    // set the winner as the player with lives
    await redis.hset(gameId, "status", "FINISHED");
    return;
  }

  // if the new next player has no lives, get the next player in the order until he has lives
  while (newNextPlayerLives === "0") {
    // verify if the next player is the last one in the order
    nextPlayerIndex++;
    if (nextPlayerIndex === order.length - 1) {
      newNextPlayer = order[0];
    }
    // get the next player in the order
    newNextPlayer = order[nextPlayerIndex];
    // get the lives of the next player
    newNextPlayerLives = await redis.hget(
      `${gameId}:players:${newNextPlayer}`,
      "lives"
    );
    // if the next player is the current player again, the game is over
    if (newNextPlayer === currentPlayer) {
      await redis.hset(`${gameId}`, "status", "FINISHED");
      break;
    }
  }

  // update the current player and next player in the database
  await redis
    .multi()
    .hset(`${gameId}`, "currentPlayer", newCurrentPlayer!)
    .hset(`${gameId}`, "nextPlayer", newNextPlayer)
    // current player's turn is over so he gets one more actionPoint
    .hincrby(`${gameId}:players:${currentPlayer}`, "actionPoints", 1)
    .exec();
};
