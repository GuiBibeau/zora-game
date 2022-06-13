import { useState, type FC } from "react";
import Image from "next/image";
import heart from "../public/heart.svg";
import star from "../public/star.svg";
import { useGameInstance, usePlayerId } from "hooks/GameContext";
import useSwr from "swr";
import { fetchAPI } from "helpers/fetcher";

type Props = {};

export const PlayerBoard: FC<Props> = ({}) => {
  const [waiting, setWaiting] = useState<boolean>(true);
  const roomClassName = waiting ? "justify-between" : "justify-center";

  const { id } = useGameInstance();

  const { playerId } = usePlayerId();

  const { data: playerData } = useSwr(
    playerId ? `/api/player?playerId=${playerId}&gameId=${id}` : null,
    fetchAPI
  );

  return (
    <div className="flex flex-col max-w-md gap-3 bg-yellow-300 py-5 px-8 rounded-xl font-bold text-lg text-slate-800">
      <div className={`flex flex-col text-center gap-3 w-full`}>
        <div className={`flex ${roomClassName}`}>
          <h2 className="text-xl">Room {id}</h2>
          {waiting && (
            <span className="opacity-80">Waiting on other Players...</span>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Image
              src={heart}
              width={27}
              height={27}
              alt="heart"
              className="rounded-full"
            />
            <h3>{playerData.id}</h3>
          </div>
          <div className="flex gap-4">
            {Array.from({ length: Number(playerData.lives) }, (_, index) => (
              <Image
                key={index}
                src={heart}
                width={23}
                height={23}
                alt="heart"
              />
            ))}
          </div>
        </div>
        <div className="h-7 flex justify-between">
          <div className="flex gap-2 w-full items-center">
            <div className="relative flex w-fit">
              <span className="absolute z-10 text-white top-1 left-3 font-bold">
                {playerData.actionPoints}
              </span>
              <Image src={star} width={35} height={35} alt="star" />
            </div>
            <h3>Action Points</h3>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-gradient-to-r from-red-950 to-red-1000 w-7 h-7 text-center text-white">
              {playerData.range}
            </span>
            <h3>Range</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
