import {
  DEFAULT_MAX_PLAYERS,
  DEFAULT_LIVES,
  DEFAULT_RANGE,
  DEFAULT_ACTION_POINTS,
} from "../constants";
import { redis } from "lib/redis";
import { Coordinate, isCoordinate, MoveTurn, Player, Turn } from "types/game";
import { boardGraph } from "models/board";
import { nextPlayer } from "./game.transport";

export const addPlayer = async ({
  gameId,
  playerId,
  position,
}: {
  gameId: string;
  playerId: string;
  position: Coordinate;
}) => {
  try {
    const status = await redis.hget(`${gameId}`, "status");
    if (status !== "WAITING") {
      throw new Error("Game is already started or finished");
    }

    //ensure game doesn't already have 5 players
    const players = await redis.smembers(`${gameId}:players`);

    if (players.length >= DEFAULT_MAX_PLAYERS) {
      throw new Error("Game is full");
    }

    const data = {
      id: playerId,
      position,
      lives: DEFAULT_LIVES,
      range: DEFAULT_RANGE,
      actionPoints: DEFAULT_ACTION_POINTS,
    };

    await redis
      .multi()
      .sadd(`${gameId}:players`, playerId)
      .hset(`${gameId}:positions`, position, playerId)
      .hset(`${gameId}:players:${playerId}`, data)
      .exec();

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Could not save player");
  }
};

/**
 * It gets a player's state from Redis
 * @param {string} gameId - The game ID
 * @param {string} playerId - The player's ID
 * @returns An object with the player's state.
 */
export const getPlayer = async (gameId: string, playerId: string) => {
  const playerState = await redis.hgetall(`${gameId}:players:${playerId}`);
  if (!playerState) {
    throw new Error("Player not found");
  }

  return playerState;
};
/**
 * It takes a gameId and an array of playerIds, and returns an object with the playerIds as keys and
 * the player objects as values
 * @param {string} gameId - string - The id of the game you want to get the players from
 * @param {string[]} playerIds - An array of player ids
 * @returns An object with the player id as the key and the player object as the value.
 */
export const getPlayers = async (gameId: string, playerIds: string[]) => {
  const playersList = await Promise.all(
    playerIds.map(async (playerId) => {
      const player = await getPlayer(gameId, playerId);
      return player;
    })
  );

  return playersList.reduce((acc: Record<string, Player>, player) => {
    if (typeof player.id === "string") {
      acc[player.id] = {
        id: player.id,
        position: isCoordinate(player.position) ? player.position : "1A",
        range: typeof player.range === "number" ? player.range : 1,
        lives: typeof player.lives === "number" ? player.lives : 3,
        actionPoints:
          typeof player.actionPoints === "number" ? player.actionPoints : 1,
      };
    }
    return acc;
  }, {});
};

export const movePlayer = async ({
  gameId,
  playerId,
  position,
  previousPosition,
  turn,
}: {
  gameId: string;
  playerId: string;
  position: Coordinate;
  previousPosition: Coordinate;
  turn: number;
}) => {
  // const curr = await redis.hget(gameId, "currentPlayer");
  // const next = await redis.hget(gameId, "nextPlayer");
  // // await redis.hset(gameId, "nextPlayer", "EYjzbt055SR6nf6vqR0KH");

  // console.log(curr, next);
  // return;

  // make sure it's the player's turn
  const currentPlayer = await redis.hget(`${gameId}`, "currentPlayer");

  if (currentPlayer !== playerId) {
    throw new Error("It's not your turn");
  }
  // check if the player has enough action points. Discusting typings for hackathon :(
  const player = (await getPlayer(gameId, playerId)) as unknown as Player;
  if (player.actionPoints < 1) {
    throw new Error("You don't have enough action points");
  }

  // check if the player is not trying to move to a position that's already occupied
  const usedPositions = await redis.hgetall(`${gameId}:positions`);

  if (usedPositions[position]) {
    throw new Error("Position is already occupied");
  }

  // check if the player is not trying to move to a position that's out of range
  if (!boardGraph[previousPosition].has(position)) {
    throw new Error("Position is out of range");
  }

  // once we've checked all the conditions, we can move the player
  await redis
    .multi()
    // set the new position in the hash
    .hset(`${gameId}:positions`, position, playerId)
    // remove the old position from the hash
    .hdel(`${gameId}:positions`, previousPosition)
    // decrement the player's action points
    .hincrby(`${gameId}:players:${playerId}`, "actionPoints", -1)
    // set the position on the user hash
    .hset(`${gameId}:players:${playerId}`, "position", position)
    .exec();

  // check how many actions the player has left
  const actionPoints = await redis.hget(
    `${gameId}:players:${playerId}`,
    "actionPoints"
  );

  console.log({ actionPoints });
  // if the player has no action points left, it's their turn over, so we need to set the next player
  if (actionPoints === "0") {
    await nextPlayer(gameId);
  }
};
