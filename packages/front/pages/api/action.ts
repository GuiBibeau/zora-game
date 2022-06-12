import { NextApiRequest, NextApiResponse } from "next";
import { startGame } from "transports/game.transport";

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
    const { type } = req.query;

    switch (type) {
      case "startGame":
        const { gameId } = req.body;
        await startGame(gameId);
        return res.status(200).send("success");

      default:
        res.status(400).json({});
    }

    return res.status(200).json({});
  }

  if (req.method === "DELETE") {
    res.status(204).json({});
  }
}
