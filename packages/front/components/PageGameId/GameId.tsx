import { useGameInstance } from "hooks/useGameInstance";
import { type FC } from "react";
import { useJoinGame } from "hooks/useJoinGame";
import { useCurrentPlayer } from "hooks/useCurrentPlayer";

export const GameId: FC = () => {
  const { id, board } = useGameInstance();
  const joinGame = useJoinGame();

  return (
    <div>
      <h1>GAME: {id}</h1>
      <section className="grid-cols-7 grid-rows-7 grid">
        {Object.keys(board.squares).map((square) => (
          <span className="h-12 w-12 bg-yellow-400 border" key={square}>
            {square}
          </span>
        ))}
        <button onClick={joinGame}>Join game</button>
      </section>
    </div>
  );
};
