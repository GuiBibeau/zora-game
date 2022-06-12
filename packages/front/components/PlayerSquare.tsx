import { usePlayers } from "hooks/GameContext";
import { type FC } from "react";
import { Coordinate } from "types/game";

type Props = {
  id: Coordinate;
  playerId: string;
};

export const PlayerSquare: FC<Props> = ({ id, playerId }) => {
  const players = usePlayers();

  // @ts-ignore
  const player = players[playerId];
  return (
    <span className="h-12 w-12 bg-green-400 rounded-full shadow-xl border-8 scale-125 border-green-300">
      <img
        src={player.avatar}
        alt={`${[player.id]}'s avatar`}
        className="object-cover pointer-events-none group-hover:opacity-75 rounded-full"
      />
    </span>
  );
};
