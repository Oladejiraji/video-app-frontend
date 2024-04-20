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

//! Types
interface IProps {
  children: ReactElement;
}

interface PeerContextType {
  peer: Peer.Instance | null;
  updatePeer: (peer: Peer.Instance) => void;
  cameraStream: MediaStream | null;
  updateCameraStream: (stream: MediaStream) => void;
  peerStream: MediaStream | null;
  updatePeerStream: (stream: MediaStream) => void;
  clearCameraStream: () => void;
  // audioRecorder: MediaRecorder | null;
}

const initialValues = {
  peer: null,
  updatePeer: () => {},
  cameraStream: null,
  updateCameraStream: () => {},
  peerStream: null,
  updatePeerStream: () => {},
  clearCameraStream: () => {},
  // audioRecorder: null,
};

const PeerContext = createContext<PeerContextType>(initialValues);

export const usePeerContext = () => {
  return useContext(PeerContext);
};

const PeerContextProvider = ({ children }: IProps) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);
  // const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(
  //   null
  // );

  // ! Update peer data
  const updatePeer = (peer: Peer.Instance) => {
    setPeer(peer);
  };

  // ! Update camera stream
  const updateCameraStream = (stream: MediaStream) => {
    // Get the audio track from the MediaStream
    // const audioTrack = stream.getAudioTracks()[0];

    // // Create a new MediaStream containing only the audio track
    // const audioStream = new MediaStream([audioTrack]);

    // // Create MediaRecorder for the audioStream
    // let mediaRecorder = new MediaRecorder(audioStream);

    // // Event handler for when data is available
    // mediaRecorder.ondataavailable = (event) => {
    //   // Handle recorded data here
    //   // You might want to save it, send it over the network, etc.
    //   console.log("Recorded audio data available:", event);
    // };

    // // Event handler for when recording stops
    // mediaRecorder.onstop = (event) => {
    //   console.log("Recording stopped");
    // };

    // // Start recording
    // mediaRecorder.start();

    setCameraStream(stream);
  };

  // ! Update peer stream
  const updatePeerStream = (stream: MediaStream) => {
    setPeerStream(stream);
  };

  // ! Clear camera stream
  const clearCameraStream = () => {
    cameraStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setCameraStream(null);
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
    }),
    [peer, cameraStream, peerStream]
  );
  return (
    <PeerContext.Provider value={memoizedData}>{children}</PeerContext.Provider>
  );
};

export default PeerContextProvider;
