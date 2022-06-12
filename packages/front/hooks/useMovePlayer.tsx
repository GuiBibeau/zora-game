import { fetchAPI } from "helpers/fetcher";
import Cookies from "js-cookie";
import { Coordinate } from "types/game";

export const useMovePlayer = (gameId: string, currentPosition: Coordinate) => {
  const playerId = Cookies.get(gameId);

  return async (position: Coordinate) => {
    if (!playerId) return;

    await fetchAPI(`/api/action?type=move`, {
      method: "POST",
      data: {
        playerId,
        position,
        gameId,
        previousPosition: currentPosition,
      },
    });
  };
};
