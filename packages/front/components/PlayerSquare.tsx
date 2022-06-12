import { type FC } from "react";
import { Coordinate, isCoordinate } from "types/game";
import cn from "clsx";
import { useGamePositions } from "hooks/useGamePositions";
import useSwr from "swr";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { fetchAPI } from "helpers/fetcher";
import { boardGraph } from "models/board";
import { useMovePlayer } from "hooks/useMovePlayer";

type Props = {
  id: Coordinate;
};

export const PlayerSquare: FC<Props> = ({ id }) => {
  return <span className="h-12 w-12 bg-green-400">{id}</span>;
};
