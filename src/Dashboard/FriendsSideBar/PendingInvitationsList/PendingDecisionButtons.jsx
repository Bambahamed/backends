import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, Button } from "@mui/material";
const PendingDecisionButtons = ({
  disabled,
  acceptInvitationHandler,
  rejectFriendInvitation,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Button
        style={{ color: "green" }}
        disabled={disabled}
        onClick={acceptInvitationHandler}
      >
        <CheckCircleOutlineIcon />
      </Button>
      <Button
        style={{ color: "red" }}
        disabled={disabled}
        onClick={rejectFriendInvitation}
      >
        <HighlightOffIcon />
      </Button>
    </Box>
  );
};

export default PendingDecisionButtons;
