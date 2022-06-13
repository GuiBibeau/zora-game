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

  const boardKeys = Object.keys(boardGraph);
  const isWaiting = status === "WAITING";

  const lives = playerData ? new Array(Number(playerData.lives)).fill("❤") : [];
  const turnLabel =
    currentPlayer === playerId
      ? "Your turn: choose a player to attack or a spot to move!"
      : "waiting on other players";

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen flex flex-col items-center">
      {isWaiting ? (
        <JoinGame session={session} />
      ) : (
        <>
          <h1 className="font-bangers text-3xl mt-12">Battleshot!</h1>
          <h1 className="font-bangers text-xl">Room: {id}</h1>

          {currentPlayer && (
            <h1 className="font-bangers text-xl">Lives: {lives.join("")}</h1>
          )}

          <h1 className="font-bangers">{turnLabel}</h1>

          <div className="max-w-5xl flex justify-center mt-8">
            <section className="grid-cols-7 grid-rows-7 grid gap-2">
              {isWaiting
                ? boardKeys.map((key) => (
                    <EmptySquare key={key} id={key as Coordinate} />
                  ))
                : boardKeys.map((square) => {
                    return (
                      <GameSquare id={square as Coordinate} key={square} />
                    );
                  })}
              {}
            </section>
          </div>
        </>
      )}
    </div>
  );
};
