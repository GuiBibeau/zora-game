import {
  DEFAULT_MAX_PLAYERS,
  DEFAULT_LIVES,
  DEFAULT_RANGE,
  DEFAULT_ACTION_POINTS,
} from "../constants";
import { redis } from "lib/redis";
import { Player } from "models/player";
import { Coordinate, isCoordinate } from "types/game";

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
    const status = await redis.get(`${gameId}:status`);
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

    const res = await redis
      .multi()
      .sadd(`${gameId}:players`, playerId)
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
