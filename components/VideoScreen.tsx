import React, { useRef, useEffect } from "react";
import { usePeerContext } from "../context/PeerContext";
import AudioIndicator from "./AudioIndicator";

const VideoScreen = () => {
  const { cameraStream } = usePeerContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleCanPlay = () => {
    videoRef.current!.play;
  };
  if (cameraStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = cameraStream;
  }
  return (
    <div className="">
      <AudioIndicator />
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
