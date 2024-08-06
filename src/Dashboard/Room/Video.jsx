import { styled } from "@mui/material";
import React, { useEffect, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const MainContainer = styled("div")({
  position: "relative",
  height: "45%",
  width: "45%",
  backgroundColor: "black",
  borderRadius: "8px",
  marginRight: "10px",
  marginTop: "10px",
});

const VideoEl = styled("video")({
  width: "100%",
  height: "100%",
});

const Name = styled("p")({
  textAlign: "center",
  fontWeight: "bold",
  marginTop: "-25px",
  marginLeft: "135px",
  color: "white",
});

const MicStatus = styled("div")({
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  padding: "5px",
});

const Video = ({ stream, isLocalStream, username, isMicMuted }) => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;

    if (video && stream && stream instanceof MediaStream) {
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      };
    } else {
      console.error("Invalid stream:", stream);
    }
  }, [stream]);

  return (
    <MainContainer>
      <VideoEl ref={videoRef} autoPlay muted={isLocalStream} />
      <Name>{username}</Name>
      <MicStatus>{isMicMuted ? <MicOffIcon /> : ""}</MicStatus>
    </MainContainer>
  );
};

export default Video;
