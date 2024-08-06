import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { connect } from "react-redux";
import { setMicStatus } from "../../../store/actions/roomActions";
import { emitMicStatus } from "../../../realtimeCommunication/socketConnection";

const MicButton = ({ localStream, userId, userDetails }) => {
  userId = userDetails._id;
  /* const isMicMuted = false || micStatuses[userDetails._id]; */
  const [isMicMuted, setIsMicMuted] = useState(true);

  const handleToggleMic = () => {
    localStream.getAudioTracks()[0].enabled = isMicMuted;
    /* setMicStatus(userId, isMicMuted); */
    setIsMicMuted(!isMicMuted);

    // Envoyer l'état du micro via le socket
    emitMicStatus(userId, !isMicMuted);
  };
  useEffect(() => {
    handleToggleMic();
  }, [userId]);

  return (
    <IconButton onClick={handleToggleMic} style={{ color: "white" }}>
      {isMicMuted ? <MicOffIcon /> : <MicIcon />}
    </IconButton>
  );
};

const mapStoreStateToProps = ({ room, auth }) => {
  return {
    micStatuses: room.micStatuses,
    ...room,
    ...auth,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setMicStatus: (userId, isMuted) => dispatch(setMicStatus(userId, isMuted)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(MicButton);
