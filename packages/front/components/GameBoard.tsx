import { type FC } from "react";
import { useJoinGame } from "hooks/useJoinGame";
import useSwr, { useSWRConfig } from "swr";
import { fetchAPI } from "helpers/fetcher";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { boardGraph } from "models/board";
import { GameSquare } from "./GameSquare";
import { useMovePlayer } from "hooks/useMovePlayer";
import { useStartGame } from "hooks/useStartGame";
import { Coordinate } from "types/game";

export const GameBoard: FC = () => {
  const { id, status, currentPlayer, currentTurn, nextPlayer } =
    useGameInstance();
  const { playerId } = usePlayerId();

  const joinGame = useJoinGame();
  const startGame = useStartGame();

  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${id}` : null,
    fetchAPI
  );

  const handleStart = () => {
    startGame();
  };

  return (
    <div>
      <h1>
        GAME: {id} is {status}
      </h1>
      <h1>
        {currentPlayer &&
          `You are ${playerData.id} your position is ${playerData.position}, you have{" "}
        ${playerData.lives} lives and you have ${playerData.actionPoints} action.
        Your range is ${playerData.range}`}
      </h1>
      <h1>{currentPlayer} is playing</h1>
      <section className="grid-cols-7 grid-rows-7 grid">
        {Object.keys(boardGraph).map((square) => {
          return <GameSquare id={square as Coordinate} key={square} />;
        })}
        {!playerData && <button onClick={joinGame}>Join game</button>}
      </section>
      {status === "WAITING" && (
        <button onClick={handleStart}>Start Game</button>
      )}
    </div>
  );
};
