import React, { useRef, useEffect } from "react";
import { usePeerContext } from "../context/PeerContext";
import AudioIndicator from "./AudioIndicator";
import { Visualizer } from "react-sound-visualizer";

const VideoScreen = () => {
  const { cameraStream, audioStream } = usePeerContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleCanPlay = () => {
    videoRef.current!.play;
  };
  if (cameraStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = cameraStream;
  }

  return (
    <div className="">
      <div className="absolute top-[10px] left-[10px] z-[1000000] ">
        <Visualizer
          audio={audioStream}
          autoStart
          mode="current"
          strokeColor="white"
        >
          {({ canvasRef }) => (
            <canvas ref={canvasRef} width={100} height={50} />
          )}
        </Visualizer>
      </div>
      <video
        ref={videoRef}
        className="object-cover full-video"
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

export default VideoScreen;
