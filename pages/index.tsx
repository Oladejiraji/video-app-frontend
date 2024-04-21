import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Peer, { SignalData } from "simple-peer";
import { AiFillVideoCamera } from "react-icons/ai";
import { MdKeyboardAlt } from "react-icons/md";
import { usePeerContext } from "../context/PeerContext";
import { useSocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";
import { CAPTURE_OPTIONS, userIdKey } from "../constants/static";

export default function Home() {
  const router = useRouter();
  const {
    updatePeer,
    cameraStream,
    updateCameraStream,
    clearCameraStream,
    updatePeerStream,
  } = usePeerContext();
  const { socketGlob } = useSocketContext();

  //! Create meeting
  const createMeeting = async () => {
    if (!socketGlob) {
      toast("Unable to connect to server! Try refreshing your page");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
      updateCameraStream(stream);

      const peer = new Peer({
        initiator: true,
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
        stream,
        objectMode: true,
        answerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
      });
      updatePeer(peer);

      // Event for when peer gets signal data
      peer.on("signal", (signalData: SignalData) => {
        socketGlob.emit("saveSignalOffer", signalData);
      });
      peer.on("connect", () => {
        peer.send("hey peer2, how is it going?");
      });
      // peer.on("data", (data) => {
      //   console.log("got a message from peer1: " + data);
      // });
      peer.on("stream", (stream) => {
        updatePeerStream(stream);
      });
      const userId = localStorage.getItem(userIdKey);
      router.push(`/video/${userId}`);
    } catch (err: any) {
      clearCameraStream();
      toast(err?.message);
    }
  };
  return (
    <div>
      <Head>
        <title>Video App</title>
        <meta name="description" content="Video App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center h-screen max-w-[1000px] mx-[30px] sm:mx-[100px] leading-[3rem]">
        <div>
          <h1 className="text-[26px] sm:text-[40px] mb-[1rem] leading-[2rem] sm:leading-[3rem] ">
            Connect with your friends using video app
          </h1>
          <div className="flex flex-col-reverse sm:flex-row gap-[20px] sm:items-center">
            <button
              className="flex items-center gap-[8px] bg-[#845EC2] text-white px-[16px] rounded-[6px] max-w-[180px]"
              onClick={createMeeting}
            >
              <AiFillVideoCamera />
              <span>New Call</span>
            </button>
            <form>
              <div className="relative">
                <MdKeyboardAlt className="absolute left-[10px] top-[50%] translate-y-[-50%] text-[#b4b4b4]" />
                <input
                  type="text"
                  placeholder="Join a call with a link"
                  className="border-[1px] border-[#b4b4b4] pl-[40px] pr-[6px] rounded-[8px]"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
