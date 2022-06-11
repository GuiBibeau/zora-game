import { type FC } from "react";
import { useJoinGame } from "hooks/useJoinGame";
import useSwr from "swr";
import { fetchAPI } from "helpers/fetcher";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { boardGraph } from "models/board";
import { isCoordinate } from "types/game";
import { GameSquare } from "./GameSquare";

export const GameBoard: FC = () => {
  const { id } = useGameInstance();
  const joinGame = useJoinGame();
  const { playerId } = usePlayerId();

  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${id}` : null,
    fetchAPI
  );

  return (
    <div>
      <h1>GAME: {id}</h1>
      <section className="grid-cols-7 grid-rows-7 grid">
        {Object.keys(boardGraph).map((square) => (
          <GameSquare id={square} key={square} />
        ))}
        {!playerData && <button onClick={joinGame}>Join game</button>}
      </section>
    </div>
  );
};
