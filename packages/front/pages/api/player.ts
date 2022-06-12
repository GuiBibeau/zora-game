import { NextApiRequest, NextApiResponse } from "next";
import { getPlayer } from "transports/player.transport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    res.status(201).json({});
  }

  if (req.method === "GET") {
    const { playerId, gameId } = req.query;
    console.log(playerId, gameId);

    if (!playerId || typeof playerId !== "string") {
      return res.status(400).json({ error: "playerId is wrong" });
    }
    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ error: "playerId is wrong" });
    }

    const player = await getPlayer(gameId, playerId);

    return res.status(200).json(player);
  }

  if (req.method === "POST") {
    res.status(204).json({});
  }

  if (req.method === "DELETE") {
    res.status(204).json({});
  }
}
