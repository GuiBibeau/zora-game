import { type FC } from "react";
import { Coordinate, isCoordinate } from "types/game";
import cn from "clsx";
import { useGamePositions } from "hooks/useGamePositions";
import useSwr from "swr";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { fetchAPI } from "helpers/fetcher";
import { boardGraph } from "models/board";
import { PlayerSquare } from "./PlayerSquare";
import { EnemySquare } from "./EnemySquare";
import { TargetSquare } from "./TargetSquare";
import { EmptySquare } from "./EmptySquare";

type Props = {
  id: Coordinate;
};

export const GameSquare: FC<Props> = ({ id }) => {
  const { id: gameId } = useGameInstance();
  const positions = useGamePositions();

  const { playerId } = usePlayerId();
  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${gameId}` : null,
    fetchAPI,
    {
      refreshInterval: 1000,
    }
  );

  // player square
  if (playerData && playerData.position === id) {
    return <PlayerSquare id={id} />;
  }

  // enemy positions
  if (id in positions) {
    return <EnemySquare id={id} />;
  }

  // player can move to those squares
  if (playerData && boardGraph[playerData.position as Coordinate].has(id)) {
    return <TargetSquare id={id} />;
  }

  return <EmptySquare id={id} />;
};
