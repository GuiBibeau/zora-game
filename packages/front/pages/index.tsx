import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
// import { createGame } from "transports/game";
import { useRouter } from "next/router";
import { fetchAPI } from "helpers/fetcher";

const Home: NextPage = () => {
  const router = useRouter();
  const handleCreateGame = async () => {
    const game = await fetchAPI("/api/game", {
      method: "POST",
    });

    router.push(`/game/${game.id}`);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={handleCreateGame}>Create new Game</button>
      <main className="grid-cols-7 grid"></main>
    </div>
  );
};

export default Home;
