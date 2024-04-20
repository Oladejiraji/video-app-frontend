import Head from "next/head";
import React, { useEffect, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import {
  ConnectionModal,
  Controls,
  PeerVideoScreen,
  VideoScreen,
} from "../../components";
import { CAPTURE_OPTIONS, userIdKey } from "../../constants/static";
import { usePeerContext } from "../../context/PeerContext";
import { useRouter } from "next/router";
import { useSocketContext } from "../../context/SocketContext";
import { useLocalStorage } from "../../hooks";

const Video = () => {
  const router = useRouter();
  const { id } = router.query;
  const confirmId = id as string | undefined;
  const { socketGlob } = useSocketContext();
  const [userId] = useLocalStorage(userIdKey);
  const {
    updateCameraStream,
    cameraStream,
    clearCameraStream,
    peer: currPeer,
    updatePeer,
    peer: storedPeer,
    updatePeerStream,
    peerStream,
  } = usePeerContext();

  //! Check if important data is available and if user went to his own peer page
  useEffect(() => {
    if (!confirmId) return;
    if (currPeer) return;
    if (!socketGlob) return;
    if (userId === id) {
      router.push("/");
      return;
    }
  }, [socketGlob, confirmId]);

  //! Start camera for person joining the call (camera has not been started yet)
  useEffect(() => {
    if (!id || !userId) return;
    if (cameraStream) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          CAPTURE_OPTIONS
        );
        updateCameraStream(stream);
      } catch (err) {
        clearCameraStream();
        console.log(err);
      }
    };
    startCamera();
    return () => {
      clearCameraStream();
    };
  }, [id, userId]);

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!id || !userId) return;
    if (userId === id) return;
    setIsOpen(true);
  }, [userId, id]);

  //! Function to connect to peer
  const peerConnection = () => {
    if (!confirmId) return;
    if (currPeer) return;
    if (!socketGlob) return;
    if (userId === id) {
      router.push("/");
      return;
    }

    const peer = new Peer({
      initiator: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: process.env.NEXT_PUBLIC_ICE_EMAIL,
            credential: process.env.NEXT_PUBLIC_ICE_PWD,
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: process.env.NEXT_PUBLIC_ICE_EMAIL,
            credential: process.env.NEXT_PUBLIC_ICE_PWD,
          },
        ],
      },
      trickle: false,
      stream: cameraStream || undefined,
      objectMode: true,
      answerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    });
    updatePeer(peer);
    // Event for when peer gets signal data
    peer.on("signal", (signalData: SignalData) => {
      socketGlob.emit("sendSignalAnswer", signalData, confirmId);
    });
    peer.on("connect", () => {
      peer.send("hey peer2, how is it going?");
    });

    peer.on("stream", (stream) => {
      updatePeerStream(stream);
    });
    socketGlob.emit("getSignalOffer", confirmId);
    setIsOpen(false);
  };

  const handleRouteChange = () => {
    clearCameraStream();
  };
  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  // useEffect(() => {
  //   if (!cameraStream) return;
  //   const AudioContext = window.AudioContext;
  //   const audioContext = new AudioContext();

  //   // Create an audio source from the microphone stream
  //   const source = audioContext.createMediaStreamSource(cameraStream);

  //   // Create an analyser node
  //   const analyser = audioContext.createAnalyser();
  //   analyser.fftSize = 2048;

  //   // Connect the source to the analyser
  //   source.connect(analyser);
  //   // Start the speech detection loop
  //   const audioInterval = setInterval(() => {
  //     // Get the frequency data from the analyser
  //     const bufferLength = analyser.frequencyBinCount;
  //     const dataArray = new Uint8Array(bufferLength);
  //     analyser.getByteFrequencyData(dataArray);
  //     console.log(dataArray);

  //     // Calculate the average volume
  //     const averageVolume =
  //       dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
  //   }, 100); // Adjust the interval according to your needs

  //   return () => {
  //     clearInterval(audioInterval);
  //   };
  // }, [cameraStream]);

  return (
    <div>
      <Head>
        <title>Video App</title>
        <meta name="description" content="Video App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen bg-[#292929] px-[0px] sm:px-[60px] py-[80px]">
        <div className="w-full h-full bg-[black] rounded-[8px] mb-[20px] flex items-center justify-center relative">
          <VideoScreen />
          <PeerVideoScreen />
        </div>
        <Controls />
        <ConnectionModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          connect={peerConnection}
        />
      </main>
    </div>
  );
};

export default Video;
