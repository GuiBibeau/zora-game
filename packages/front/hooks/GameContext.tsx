import { fetchAPI } from "helpers/fetcher";
import { emptyPositions } from "models/board";
import { proxy } from "valtio";
import * as React from "react";
import useSwr from "swr";
import { GamePayload } from "transports/game.transport";
import { APIGetGame } from "types/api";
import { Coordinate, isCoordinate, Player } from "types/game";
import { usePrevious } from "./usePrevious";

type State = {
  id: string;
  game: GamePayload;
  playerId?: string;
  setPlayerId: (playerId: string) => void;
  players?: Record<string, Player>;
  positions: Record<Coordinate, string>;
};

type Props = {
  id: string;
  playerId?: string;
};

export const GameStateContext = React.createContext<State | undefined>(
  undefined
);

export const positions = proxy(emptyPositions);

export function GameProvider({
  children,
  id,
  playerId: initialPlayerId,
}: React.PropsWithChildren<Props>) {
  const { data } = useSwr<APIGetGame>(`/api/game?id=${id}`, fetchAPI, {
    refreshInterval: 5000,
  });
  const { data: positions } = useSwr<any>(
    `/api/positions?gameId=${id}`,
    fetchAPI,
    {
      refreshInterval: 2500,
    }
  );

  const [playerId, setPlayerId] = React.useState<string | undefined>(
    initialPlayerId
  );

  return (
    <GameStateContext.Provider
      value={{
        id,
        game: data?.game!,
        playerId,
        setPlayerId,
        players: data?.players,
        positions,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameInstance = () => {
  const context = React.useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameInstance must be used within a GameProvider");
  }
  const { game } = context;
  return game;
};

export const useBoard = () => {
  const context = React.useContext(GameStateContext);
  if (!context) {
    throw new Error("useBoard must be used within a GameProvider");
  }
};

export const usePlayerId = () => {
  const context = React.useContext(GameStateContext);
  if (!context) {
    throw new Error("usePlayerId must be used within a GameProvider");
  }
  const { playerId, setPlayerId } = context;
  return { playerId, setPlayerId };
};

export const usePlayers = () => {
  const context = React.useContext(GameStateContext);
  if (!context) {
    throw new Error("usePLayers must be used within a GameProvider");
  }
  const { players } = context;
  return players;
};
