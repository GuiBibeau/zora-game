import { GameBoard } from "components/GameBoard";
import { GameProvider } from "hooks/GameContext";
import { type GetServerSideProps, type NextPage } from "next";
import { SWRConfig } from "swr";
import { type GamePayload, getGame } from "transports/game.transport";
import { getPlayers } from "transports/player.transport";

type Props = {
  fallback: Record<string, GamePayload>;
  id: string;
  playerId?: string;
};

export const GameRoom: NextPage<Props> = ({ fallback, id, playerId }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GameProvider id={id} playerId={playerId}>
        <GameBoard />
      </GameProvider>
    </SWRConfig>
  );
};

export default GameRoom;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query?.id !== "string")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const id = context.query?.id;

  const game = await getGame(id);

  if (!game) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const playerId = context.req.cookies[id];

  console.log({ playerId });

  const players = await getPlayers(id, game.players);

  return {
    props: {
      id,
      ...(playerId ? { playerId } : {}),
      fallback: {
        [`/api/game?id=${id}`]: { game, players },
        ...(playerId && {
          [`/api/player?playerId=${playerId}&gameId=${id}`]: {
            ...players[playerId],
          },
        }),
      },
    },
  };
};
