import React, { CSSProperties, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { usePeerContext } from "../context/PeerContext";
import { Visualizer } from "react-sound-visualizer";

const style: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  borderRadius: "20px",
};

const PeerVideoScreen = () => {
  const { peerStream, audioPeerStream } = usePeerContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleCanPlay = () => {
    videoRef.current!.play;
  };
  if (peerStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = peerStream;
  }
  return (
    <div className="absolute right-[30px] bottom-[60px] w-[120px] h-[180px] z-[100] ">
      {peerStream && (
        <div className="absolute top-[0px] left-[10px] z-[1000000] ">
          <Visualizer
            audio={audioPeerStream}
            autoStart
            mode="current"
            strokeColor="white"
          >
            {({ canvasRef }) => (
              <canvas ref={canvasRef} width={100} height={40} />
            )}
          </Visualizer>
        </div>
      )}
      <video
        className=" w-[220px] h-[220px] object-cover rounded-[10px]"
        ref={videoRef}
        //   hidden={!isVideoPlaying}
        onCanPlay={handleCanPlay}
        autoPlay
        playsInline
        muted
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
};

export default PeerVideoScreen;
