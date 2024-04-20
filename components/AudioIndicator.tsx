import React from "react";
import Wave from "react-wavify";

const AudioIndicator = () => {
  return (
    <div className="absolute top-0 left-0 ">
      <Wave
        fill="#f79902"
        paused={false}
        style={{ display: "flex", height: "40px", width: "40px" }}
        options={{
          height: 2,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      />
    </div>
  );
};

export default AudioIndicator;
