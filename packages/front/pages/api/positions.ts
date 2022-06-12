import { NextApiRequest, NextApiResponse } from "next";
import { getPositions } from "transports/game.transport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    res.status(201).json({});
  }

  if (req.method === "GET") {
    const { gameId } = req.query;
    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ error: "gameId is wrong" });
    }
    const positions = await getPositions(gameId);
    return res.status(200).json(positions);
  }

  if (req.method === "POST") {
    res.status(201).json({});
  }

  if (req.method === "DELETE") {
    res.status(204).json({});
  }
}
