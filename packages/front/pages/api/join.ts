import { NextApiRequest, NextApiResponse } from "next";
import { setGameOrder } from "transports/game.transport";
import { addPlayer } from "transports/player.transport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    res.status(201).json({});
  }

  if (req.method === "GET") {
  }

  if (req.method === "POST") {
    const { playerId, gameId } = req.query;

    if (!playerId || typeof playerId !== "string") {
      return res.status(400).json({ error: "playerId is wrong" });
    }

    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ error: "playerId is wrong" });
    }

    const { position, order } = req.body;

    const player = await addPlayer({ playerId, position, gameId });
    await setGameOrder(gameId, order);

    return res.status(200).json(player);
  }

  if (req.method === "DELETE") {
    res.status(204).json({});
  }
}
