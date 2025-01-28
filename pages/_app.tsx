import "@/styles/globals.css";
import 'abcjs/abcjs-audio.css';
import type { AppProps } from "next/app";
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://unpkg.com/vextab/releases/vextab-div.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
