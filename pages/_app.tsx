import { AppProps } from "next/app";
import Navigation from "../components/navigation";

import './reset-style.css'
import './global-style.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
