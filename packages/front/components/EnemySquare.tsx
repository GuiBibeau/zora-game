import { useGameInstance, usePlayerId, usePlayers } from "hooks/GameContext";
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
  enemyId: string;
};

export const EnemySquare: FC<Props> = ({ id, enemyId }) => {
  const { id: gameId } = useGameInstance();
  const players = usePlayers();

  // @ts-ignore
  const player = players[enemyId];

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

  const baseClass = "h-12 w-12 rounded-full";
  const inRangeClass =
    playerData && boardGraph[playerData.position as Coordinate].has(id)
      ? "border border-red-900 animate-pulse bg-red-700 cursor-pointer hover:scale-125 border-8 "
      : "bg-red-500";
  const classes = cn(baseClass, inRangeClass);

  return (
    <span onClick={handleAttack} className={classes}>
      <img
        src={player.avatar}
        alt={`${[player.id]}'s avatar`}
        className="object-cover pointer-events-none group-hover:opacity-75 rounded-full"
      />
    </span>
  );
};
