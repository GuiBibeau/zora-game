import { fetchAPI } from "helpers/fetcher";
import Cookies from "js-cookie";
import { Coordinate } from "types/game";

export const useMovePlayer = (gameId: string) => {
  const playerId = Cookies.get(gameId);

  return async (position: Coordinate) => {
    if (!playerId) return;

    await fetchAPI(`/api/move`, {
      method: "POST",
      data: {
        playerId,
        position,
        gameId,
      },
    });
  };
};
