import "@/styles/globals.css";
import 'abcjs/abcjs-audio.css';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
