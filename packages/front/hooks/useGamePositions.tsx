import React from "react";
import { GameStateContext } from "./GameContext";

export const useGamePositions = () => {
  const context = React.useContext(GameStateContext);
  if (!context) {
    throw new Error("useGamePositions must be used within a GameProvider");
  }
  const { positions } = context;
  return positions;
};
