import React from "react";
import { GameStateContext } from "./GameContext";

export function useGameInstance() {
  const context = React.useContext(GameStateContext);
  if (context === undefined || context.game === undefined) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context.game;
}
