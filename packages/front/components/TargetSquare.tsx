import { type FC } from "react";
import { Coordinate, isCoordinate } from "types/game";
import cn from "clsx";
import { useGamePositions } from "hooks/useGamePositions";
import useSwr from "swr";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { fetchAPI } from "helpers/fetcher";
import { boardGraph } from "models/board";
import { useMovePlayer } from "hooks/useMovePlayer";
import { PlayerSquare } from "./PlayerSquare";

type Props = {
  id: Coordinate;
};

export const TargetSquare: FC<Props> = ({ id }) => {
  const { id: gameId } = useGameInstance();
  const positions = useGamePositions();

  const { playerId } = usePlayerId();
  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${gameId}` : null,
    fetchAPI
  );
  const movePlayer = useMovePlayer(gameId, playerData.position);
  const baseClass = "h-12 w-12 border";

  const handleMove = () => {
    movePlayer(id);
  };
  const classes = cn(
    baseClass,
    " border-2 border-purple-700 cursor-pointer bg-blue-400"
  );
  return (
    <span onClick={handleMove} className={classes}>
      {id}
    </span>
  );
};
