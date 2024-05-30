import React from "react";
import { BsCameraVideo } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import { MdOutlineScreenShare, MdCallEnd } from "react-icons/md";
import { usePeerContext } from "../context/PeerContext";

const Controls = () => {
  const { endConnection } = usePeerContext();
  return (
    <div className="bg-[#f4f4f4] rounded-[8px] flex items-center justify-center h-[50px]">
      <div className="flex items-center justify-center gap-[40px]">
        {/* <button onClick={clearCameraStream}>
          <BsCameraVideo />
        </button>
        <button>
          <BiMicrophone />
        </button>
        <button>
          <MdOutlineScreenShare />
        </button> */}
        <button
          className="bg-[red] rounded-full p-2 items-center justify-center"
          onClick={endConnection}
        >
          <MdCallEnd className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
