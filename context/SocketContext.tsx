import {
  useState,
  useContext,
  createContext,
  useMemo,
  ReactElement,
  useEffect,
} from "react";
import { Socket, io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../constants/socketTypes";
import { userIdKey } from "../constants/static";
import { useRouter } from "next/router";
import { usePeerContext } from "./PeerContext";
import { useLocalStorage } from "../hooks";

//! Types
interface IProps {
  children: ReactElement;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socketGlob: SocketType | null;
}

const initialValues = {
  socketGlob: null,
};

const SocketContext = createContext<SocketContextType>(initialValues);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

const SocketContextProvider = ({ children }: IProps) => {
  const [socketGlob, setSocketGlob] = useState<SocketType | null>(null);
  const { peer } = usePeerContext();

  useEffect(() => {
    let userId = localStorage.getItem(userIdKey);
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(userIdKey, userId);
    }
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;
    const socket: SocketType = io(socketUrl, {
      query: { userId },
    });
    updateSocket(socket);
  }, []);

  useEffect(() => {
    if (!peer) return;
    if (!socketGlob) return;
    let userId = localStorage.getItem(userIdKey);
    socketGlob.on("getSignalDetails", (offer, senderId) => {
      if (senderId === userId) return;
      peer?.signal(offer);
    });
    socketGlob.on("sendSignalAnswer", (answer, senderId) => {
      if (senderId !== userId) return;
      peer.signal(answer);
    });
    return () => {
      socketGlob.off("getSignalDetails");
      socketGlob.off("sendSignalAnswer");
    };
  }, [peer, socketGlob]);

  // ! Update socket
  const updateSocket = (socket: SocketType) => {
    setSocketGlob(socket);
  };

  const memoizedData = useMemo(
    () => ({
      socketGlob,
    }),
    [socketGlob]
  );
  return (
    <SocketContext.Provider value={memoizedData}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
