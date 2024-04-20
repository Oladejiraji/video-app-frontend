export const CAPTURE_OPTIONS: MediaStreamConstraints = {
  audio: true,
  video: {
    facingMode: "user",
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  },
};

export const socketUrl = "http://localhost:4010";

export const userIdKey = "user_id_videoappxy";
