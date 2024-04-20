import React from "react";
import { BsCameraVideo } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import { MdOutlineScreenShare, MdCallEnd } from "react-icons/md";
import { usePeerContext } from "../context/PeerContext";

const Controls = () => {
  const { clearCameraStream } = usePeerContext();
  return (
    <div className="bg-[#f4f4f4] rounded-[8px] flex items-center justify-center h-[40px]">
      <div className="flex items-center justify-center gap-[40px]">
        <button onClick={clearCameraStream}>
          <BsCameraVideo />
        </button>
        <button>
          <BiMicrophone />
        </button>
        <button>
          <MdOutlineScreenShare />
        </button>
        <button>
          <MdCallEnd />
        </button>
      </div>
    </div>
  );
};

export default Controls;
