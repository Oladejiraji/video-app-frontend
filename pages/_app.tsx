import "../styles/globals.css";
import type { AppProps } from "next/app";
import GeneralContextProvider from "../context/GeneralContext";
import PeerContextProvider from "../context/PeerContext";
import SocketContextProvider from "../context/SocketContext";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded) {
    return null;
  }
  return (
    <GeneralContextProvider>
      <PeerContextProvider>
        <SocketContextProvider>
          <>
            <Component {...pageProps} />
            <ToastContainer />
          </>
        </SocketContextProvider>
      </PeerContextProvider>
    </GeneralContextProvider>
  );
}
