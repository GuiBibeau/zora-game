import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { useAttackEnemy } from "hooks/useAttackEnemy";
import { useGamePositions } from "hooks/useGamePositions";
import { type FC } from "react";
import { Coordinate } from "types/game";
import cn from "clsx";
import useSwr from "swr";
import { fetchAPI } from "helpers/fetcher";
import { boardGraph } from "models/board";

type Props = {
  id: Coordinate;
};

export const EnemySquare: FC<Props> = ({ id }) => {
  const { id: gameId } = useGameInstance();

  const { playerId } = usePlayerId();
  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${gameId}` : null,
    fetchAPI,
    {
      refreshInterval: 1000,
    }
  );

  const attackEnemy = useAttackEnemy(gameId);

  const handleAttack = async () => {
    await attackEnemy(id);
  };

  const baseClass = "h-12 w-12 ";
  const inRangeClass =
    playerData && boardGraph[playerData.position as Coordinate].has(id)
      ? "border border-red-500 animate-pulse bg-red-700 cursor-pointer"
      : "bg-red-500";
  const classes = cn(baseClass, inRangeClass);

  return (
    <span onClick={handleAttack} className={classes}>
      {id}
    </span>
  );
};
