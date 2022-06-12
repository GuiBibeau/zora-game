import { fetchAPI } from "helpers/fetcher";
import Cookies from "js-cookie";
import { Coordinate } from "types/game";

export const useAttackEnemy = (gameId: string) => {
  const playerId = Cookies.get(gameId);

  return async (target: Coordinate) => {
    if (!playerId) return;

    await fetchAPI(`/api/action?type=attack`, {
      method: "POST",
      data: {
        gameId,
        playerId,
        target,
      },
    });
  };
};
