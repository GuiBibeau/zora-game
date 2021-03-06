import type { NextPage } from "next";
import Head from "next/head";
// import { createGame } from "transports/game";
import { useRouter } from "next/router";
import { fetchAPI } from "helpers/fetcher";
import Image from "next/image";
import { HashtagIcon, UsersIcon } from "@heroicons/react/solid";
import { ChangeEvent, FormEvent, useState } from "react";

const Home: NextPage = () => {
  const [gameRoom, setGameRoom] = useState("");
  const router = useRouter();
  const handleCreateGame = async () => {
    const game = await fetchAPI("/api/game", {
      method: "POST",
    });

    router.push(`/game/${game.id}`);
  };

  const handleRoomChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGameRoom(event.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    // todo check if game exists and error state if not
    if (gameRoom.length === 6) {
      e.preventDefault();
      await router.prefetch(`/game/${gameRoom}`);
      router.push(`/game/${gameRoom}`);
    }
  };
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen flex flex-col items-center">
      <Head>
        <title>Battleshot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="sticky">
        <Image src="/Spikeball.svg" height={200} width={336} alt="spikeball" />
      </div>
      <section className="flex flex-col items-center z-10 -mt-44">
        <h1 className="font-bangers text-6xl mt-8">Battleshot!</h1>
        <section className="flex mt-32 justify-center">
          <Image
            src="/tank-blue.png"
            height={200}
            width={200}
            alt="blue tank"
          />
          <Image
            src="/tank-green.png"
            height={200}
            width={200}
            alt="blue tank"
          />

          <Image
            src="/tank-yellow.png"
            height={200}
            width={200}
            alt="blue tank"
          />
        </section>
      </section>
      <section className="flex  items-center justify-center space-x-6 mt-8">
        <button
          style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
          className="h-16 w-48 flex shadow-3xl justify-center border-4 border-black items-center  px-6 py-3   text-base font-medium rounded-md text-gray-700 bg-white "
          onClick={handleCreateGame}
        >
          New Game
        </button>
        <span>or</span>
        <form className=" flex items-center" onSubmit={handleSubmit}>
          <div
            className="mt-1 h-16 flex "
            style={{ boxShadow: "rgb(0, 0, 0) 10px 10px 0px 0px" }}
          >
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HashtagIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="code"
                id="code"
                value={gameRoom}
                onChange={handleRoomChange}
                className=" h-16  block w-full rounded-none rounded-l-md border-l-4 border-black border-y-4 pl-10 sm:text-sm "
                placeholder="Game Room"
              />
            </div>
            <button
              type="submit"
              className="-ml-px border-r-4 border-y-4 border-black h-16 relative inline-flex items-center space-x-2 px-4 py-2  text-sm font-medium rounded-r-md text-gray-700 bg-gray-200 hover:bg-gray-100 "
            >
              <span>Join</span>
            </button>
          </div>
        </form>
      </section>
      <main className="grid-cols-7 grid"></main>
    </div>
  );
};

export default Home;
