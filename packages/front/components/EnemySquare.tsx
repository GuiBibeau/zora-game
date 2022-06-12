import { type FC } from "react";
import { Coordinate } from "types/game";

type Props = {
  id: Coordinate;
};

export const EnemySquare: FC<Props> = ({ id }) => {
  return <span className="h-12 w-12 bg-red-400">{id}</span>;
};
