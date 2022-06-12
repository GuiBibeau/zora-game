import "../styles/globals.css";
import { WenProvider } from "wen-connect";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const config = { ssr: true };
  return (
    // @ts-ignore
    <WenProvider config={config}>
      <Component {...pageProps} />
    </WenProvider>
  );
}

export default MyApp;
