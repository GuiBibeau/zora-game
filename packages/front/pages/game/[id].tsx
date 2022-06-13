<<<<<<< HEAD
import { GameBoard } from "components/GameBoard";
import { PlayerBoard } from "components/PlayerBoard";
=======
import { Gameroom } from "components/GameRoom";
>>>>>>> f822bc72740e37defa1bccb5d92f9c3147e3e7d9
import { GameProvider } from "hooks/GameContext";
import { getSession, useWen } from "wen-connect";
import { type GetServerSideProps, type NextPage } from "next";
import { SWRConfig } from "swr";
import {
  type GamePayload,
  getGame,
  getPositions,
} from "transports/game.transport";
import { getPlayers } from "transports/player.transport";
import { WenSession } from "wen-connect/dist/core/models";

type Props = {
  fallback: Record<string, GamePayload>;
  id: string;
  playerId?: string;
  session: WenSession;
};

export const GameRoom: NextPage<Props> = ({
  fallback,
  id,
  playerId,
  session,
}) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GameProvider id={id} playerId={playerId}>
<<<<<<< HEAD
        <GameBoard />
        <PlayerBoard />
=======
        <Gameroom session={session} />
>>>>>>> f822bc72740e37defa1bccb5d92f9c3147e3e7d9
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
  const players = await getPlayers(id, game.players);
  const positions = await getPositions(id);
  const session = getSession(context);

  return {
    props: {
      session,
      id,
      ...(playerId ? { playerId } : {}),
      fallback: {
        [`/api/positions?gameId=${id}`]: positions,
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
