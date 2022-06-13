import { useGameInstance, usePlayerId, usePlayers } from "hooks/GameContext";
import { FC, useState } from "react";
import { WenSession } from "wen-connect/dist/core/models";
import { JoinModal } from "./JoinModal";
import useSwr from "swr";
import { useWen } from "wen-connect";
import { useStartGame } from "hooks/useStartGame";

/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

type Props = {
  session: WenSession;
};

export const JoinGame: FC<Props> = ({ session }) => {
  const [open, setOpen] = useState(false);
  const players = usePlayers();
  const { playerId } = usePlayerId();

  console.log(playerId);

  const playerData = players
    ? Object.values(players).map((player) => ({
        imageUrl: player.avatar,
        id: player.id,
      }))
    : [];

  const startGame = useStartGame();

  const handleStart = () => {
    startGame();
  };

  return (
    <div className="">
      <JoinModal open={open} setOpen={setOpen} session={session} />
      <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-5 sm:space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-bangers">
              Battleshot!
            </h2>
            <p className="text-2xl font-bangers">
              Join this tactical game of strategy and war! Your in game avatar
              is your NFT image!
            </p>
            {!playerId ? (
              <button
                onClick={() => setOpen(true)}
                type="button"
                style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
                className="h-16 w-48 flex shadow-3xl justify-center border-4 border-black items-center  px-6 py-3   text-base font-medium rounded-md text-gray-700 bg-white "
              >
                Join the game!
              </button>
            ) : (
              <button
                onClick={handleStart}
                type="button"
                style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
                className="h-16 w-48 flex shadow-3xl justify-center border-4 border-black items-center  px-6 py-3   text-base font-medium rounded-md text-gray-700 bg-white "
              >
                Start game
              </button>
            )}
          </div>
          <div className="lg:col-span-2">
            <ul
              role="list"
              className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8"
            >
              {playerData.map((player) => (
                <li key={player.imageUrl}>
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <img
                      className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
                      src={player.imageUrl}
                      alt=""
                    />
                    <div className="font-medium text-lg leading-6 space-y-1">
                      <h3>{player.id}</h3>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
