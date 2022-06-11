import { fetchAPI } from "helpers/fetcher";
import { Game } from "models/game";
import * as React from "react";
import useSwr from "swr";
import { APIGetGame } from "types/api";

type Action =
  | ({ type: "setGame" } & APIGetGame)
  | { type: "setCurrentPlayer"; id: string };

type Dispatch = (action: Action) => void;

type State = { id: string; game?: Game };

type Props = {
  id: string;
  playerId?: string;
};

export const GameStateContext = React.createContext<State | undefined>(
  undefined
);
export const GameDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case "setGame": {
      const { game, players } = action;

      const gameInstance = new Game({
        playersOrder: action.game.order,
        id: state.id,
        turns: [],
        status: game.status,
        players,
      });

      return { ...state, game: gameInstance };
    }
    case "setCurrentPlayer":
      // state.game?.addPlayer(action.id);

      return { ...state };
    default:
      throw new Error("Unhandled action");
  }
}

export function GameProvider({
  children,
  id,
  playerId,
}: React.PropsWithChildren<Props>) {
  console.log(playerId);
  const { data } = useSwr<APIGetGame>(`/api/game?id=${id}`, fetchAPI);
  const { data: playerData } = useSwr(
    `/api/player?playerId=${playerId}&gameId=${id}`,
    fetchAPI
  );

  console.log(playerData);

  const initialGame = new Game({
    playersOrder: data?.game.order ? data.game.order : [],
    id: data?.game.id ? data.game?.id : "",
    turns: [],
    status: data?.game.status ? data.game.status : "WAITING",
  });

  const [state, dispatch] = React.useReducer(gameReducer, {
    id,
    game: initialGame,
  });

  React.useEffect(() => {
    if (data) {
      dispatch({ type: "setGame", ...data });
    }
  }, [data]);

  // both context are separate since a lot of components will use the context. this will avoid rerenders
  return (
    <GameDispatchContext.Provider value={dispatch}>
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameDispatchContext.Provider>
  );
}
