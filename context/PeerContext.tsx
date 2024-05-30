import {
  useState,
  useContext,
  createContext,
  useMemo,
  ReactElement,
} from "react";
import Peer, { SignalData } from "simple-peer";
import { useSocketContext } from "./SocketContext";
import { useGeneralContext } from "./GeneralContext";
import { useRouter } from "next/router";

//! Types
interface IProps {
  children: ReactElement;
}

interface PeerContextType {
  peer: Peer.Instance | null;
  updatePeer: (peer: Peer.Instance) => void;
  cameraStream: MediaStream | null;
  audioStream: MediaStream | null;
  audioPeerStream: MediaStream | null;
  updateCameraStream: (stream: MediaStream) => void;
  peerStream: MediaStream | null;
  updatePeerStream: (stream: MediaStream) => void;
  clearCameraStream: () => void;
  endConnection: () => void;
}

const initialValues = {
  peer: null,
  updatePeer: () => {},
  cameraStream: null,
  updateCameraStream: () => {},
  peerStream: null,
  updatePeerStream: () => {},
  clearCameraStream: () => {},
  endConnection: () => {},
  audioStream: null,
  audioPeerStream: null,
};

const PeerContext = createContext<PeerContextType>(initialValues);

export const usePeerContext = () => {
  return useContext(PeerContext);
};

const PeerContextProvider = ({ children }: IProps) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioPeerStream, setAudioPeerStream] = useState<MediaStream | null>(
    null
  );
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);
  const router = useRouter();
  // const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(
  //   null
  // );

  // ! Update peer data
  const updatePeer = (peer: Peer.Instance) => {
    setPeer(peer);
  };

  // ! Update camera stream
  const updateCameraStream = (stream: MediaStream) => {
    const audioTracks = stream.getAudioTracks();
    // if (audioTracks.length === 0) {
    //   console.error('No audio tracks found in the MediaStream.');
    //   return null;
    // }

    const audioStreamCl = new MediaStream();
    audioStreamCl.addTrack(audioTracks[0]);
    setAudioStream(audioStreamCl);
    setCameraStream(stream);
  };

  // ! Update peer stream
  const updatePeerStream = (stream: MediaStream | null) => {
    setPeerStream(stream);
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    const audioStreamCl = new MediaStream();
    audioStreamCl.addTrack(audioTracks[0]);
    setAudioPeerStream(audioStreamCl);
  };

  // ! Clear camera stream
  const clearCameraStream = () => {
    cameraStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setCameraStream(null);
    setPeerStream(null);
  };

  // ! End Peer connection
  const endConnection = () => {
    peer?.destroy();
    clearCameraStream();
    updatePeerStream(null);
  };

  const memoizedData = useMemo(
    () => ({
      peer,
      updatePeer,
      cameraStream,
      updateCameraStream,
      clearCameraStream,
      updatePeerStream,
      peerStream,
      audioStream,
      endConnection,
      audioPeerStream,
    }),
    [peer, cameraStream, peerStream]
  );
  return (
    <PeerContext.Provider value={memoizedData}>{children}</PeerContext.Provider>
  );
};

export default PeerContextProvider;
