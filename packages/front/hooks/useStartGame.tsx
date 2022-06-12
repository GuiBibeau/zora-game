import { fetchAPI } from "helpers/fetcher";
import { useGameInstance } from "./GameContext";

export const useStartGame = () => {
  const { id } = useGameInstance();

  return () => {
    fetchAPI("/api/action?type=startGame", {
      method: "POST",
      data: { gameId: id },
    });
  };
};
