import { fetchAPI } from "helpers/fetcher";
import { nanoid } from "nanoid";
import { useGameInstance } from "./useGameInstance";
import Cookies from "js-cookie";
import { useSWRConfig } from "swr";

export const useJoinGame = (id?: string) => {
  const { mutate } = useSWRConfig();
  const { addPlayer, id: gameId } = useGameInstance();
  const playerId = id || nanoid();
  return async () => {
    const { player, order } = addPlayer(playerId);

    fetchAPI(`/api/join?playerId=${playerId}&gameId=${gameId}`, {
      method: "POST",
      data: {
        ...player,
        order,
      },
    });

    Cookies.set(gameId, playerId);
    await mutate(`/api/game?id=${gameId}`);
    await mutate(`/api/player?playerId=${playerId}&gameId=${gameId}`);
  };
};
