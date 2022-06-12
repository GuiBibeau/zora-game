import { type FC } from "react";
import { useJoinGame } from "hooks/useJoinGame";
import useSwr from "swr";
import { fetchAPI } from "helpers/fetcher";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import { boardGraph } from "models/board";
import { useStartGame } from "hooks/useStartGame";

import { JoinGame } from "./JoinGame";
import { WenSession } from "wen-connect/dist/core/models";
import { EmptySquare } from "./EmptySquare";
import { Coordinate } from "types/game";
import { GameSquare } from "./GameSquare";

type Props = {
  session: WenSession;
};

export const Gameroom: FC<Props> = ({ session }) => {
  const { id, status, currentPlayer } = useGameInstance();
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

  const boardKeys = Object.keys(boardGraph);
  const isWaiting = status === "WAITING";

  return (
    <>
      {isWaiting ? (
        <JoinGame session={session} />
      ) : (
        <>
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
            {isWaiting
              ? boardKeys.map((key) => (
                  <EmptySquare key={key} id={key as Coordinate} />
                ))
              : boardKeys.map((square) => {
                  return <GameSquare id={square as Coordinate} key={square} />;
                })}
            {}
          </section>
        </>
      )}
    </>
  );
};
