import { positions } from "hooks/GameContext";
import { type FC } from "react";
import { isCoordinate } from "types/game";
import { useSnapshot } from "valtio";
import cn from "clsx";

type Props = {
  id: string;
};

export const GameSquare: FC<Props> = ({ id }) => {
  const positionSnap = useSnapshot(positions);
  if (isCoordinate(id)) {
    const playerPresent = positionSnap[id];

    const baseClass = "h-12 w-12 border";
    const colorClass = playerPresent ? "bg-yellow-400" : "bg-blue-400";
    const classes = cn(baseClass, colorClass);
    return <span className={classes}>{id}</span>;
  }

  return null;
};
