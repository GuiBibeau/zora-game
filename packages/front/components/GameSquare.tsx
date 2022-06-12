import { type FC } from "react";
import { Coordinate, isCoordinate } from "types/game";
import cn from "clsx";
import { useGamePositions } from "hooks/useGamePositions";
import useSwr from "swr";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { fetchAPI } from "helpers/fetcher";
import { boardGraph } from "models/board";

type Props = {
  id: string;
};

export const GameSquare: FC<Props> = ({ id }) => {
  const { id: gameId, currentPlayer } = useGameInstance();
  const { playerId } = usePlayerId();
  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${gameId}` : null,
    fetchAPI
  );

  const positions = useGamePositions();
  if (isCoordinate(id)) {
    const playerPresent = positions[id];
    if (playerData.position === id) {
      return <span className="h-12 w-12 bg-green-500">{id}</span>;
    }

    const baseClass = "h-12 w-12 border";
    const colorClass = playerPresent ? "bg-red-400" : "bg-blue-400";
    const withinRangeClass = boardGraph[playerData.position as Coordinate].has(
      id
    )
      ? "border-purple-500 border-2"
      : "";
    const classes = cn(baseClass, colorClass, withinRangeClass);
    return <span className={classes}>{id}</span>;
  }

  return null;
};
