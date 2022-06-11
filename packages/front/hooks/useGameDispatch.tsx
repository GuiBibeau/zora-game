import React from "react";
import { GameDispatchContext } from "./GameContext";

export function useGameDispatch() {
  const context = React.useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error("useGameDispatch must be used within a GameProvider");
  }
  return context;
}
