import { useGameInstance } from "./useGameInstance";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useCurrentPlayer = () => {
  const { id: gameId, players } = useGameInstance();
  const [currentPlayerId, setCurrentPlayerId] = useState<string | undefined>(
    Cookies.get(gameId)
  );

  useEffect(() => {
    setCurrentPlayerId(Cookies.get(gameId));
  }, [players, currentPlayerId, gameId]);

  return players[currentPlayerId!];
};
