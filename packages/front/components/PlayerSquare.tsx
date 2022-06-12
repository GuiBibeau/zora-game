import { type FC } from "react";
import { Coordinate } from "types/game";

type Props = {
  id: Coordinate;
};

export const PlayerSquare: FC<Props> = ({ id }) => {
  return <span className="h-12 w-12 bg-green-400">{id}</span>;
};
