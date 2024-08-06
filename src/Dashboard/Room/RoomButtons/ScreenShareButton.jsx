import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopeScreenShareIcon from "@mui/icons-material/StopScreenShare";
import * as webRTCHandler from "../../../realtimeCommunication/webRTCHandler";
const constraints = {
  audio: false,
  video: true,
};

const ScreenShareButton = ({
  localStream,
  screenSharingStream,
  setScreenSharingStream,
  isScreenSharingActive,
}) => {
  const handleScreenShareToggle = async () => {
    console.log(isScreenSharingActive);
    if (!isScreenSharingActive) {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (error) {
        console.log(
          "error occurred when trying to get an acces to screen share"
        );
      }
      if (stream) {
        setScreenSharingStream(stream);
        webRTCHandler.switchOutgoingTracks(stream);
      }
    } else {
      webRTCHandler.switchOutgoingTracks(localStream);
      screenSharingStream.getTracks().forEach((t) => t.stop());
      setScreenSharingStream(null);
    }
  };

  return (
    <IconButton onClick={handleScreenShareToggle} style={{ color: "white" }}>
      {isScreenSharingActive ? <StopeScreenShareIcon /> : <ScreenShareIcon />}
    </IconButton>
  );
};

export default ScreenShareButton;
