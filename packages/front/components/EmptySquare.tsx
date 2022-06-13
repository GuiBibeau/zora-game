import { type FC } from "React";
import { Coordinate } from "types/game";

type Props = {
  id: Coordinate;
};

export const EmptySquare: FC<Props> = ({ id }) => {
  return (
    <span className="h-12 w-12 bg-[#F3BF00] shadow-lg  border rounded-3xl"></span>
  );
};
