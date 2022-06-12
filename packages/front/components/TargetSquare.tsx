import { type FC } from "react";
import { Coordinate } from "types/game";
import cn from "clsx";
import useSwr, { useSWRConfig } from "swr";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { fetchAPI } from "helpers/fetcher";

import { useMovePlayer } from "hooks/useMovePlayer";

type Props = {
  id: Coordinate;
};

export const TargetSquare: FC<Props> = ({ id }) => {
  const { id: gameId } = useGameInstance();
  const { mutate } = useSWRConfig();

  const { playerId } = usePlayerId();
  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${gameId}` : null,
    fetchAPI,
    {
      refreshInterval: 500,
    }
  );
  const movePlayer = useMovePlayer(gameId, playerData.position);
  const baseClass = "h-12 w-12 border: hover:scale-125";

  const handleMove = async () => {
    await movePlayer(id);
  };
  const classes = cn(
    baseClass,
    " border-2 border-gray-100 cursor-pointer bg-gray-400 rounded-full shadow-xl"
  );
  return <span onClick={handleMove} className={classes}></span>;
};
