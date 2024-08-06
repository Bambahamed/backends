import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import * as roomHandler from "../../realtimeCommunication/roomHandler";
import { connect } from "react-redux";

const CreateRoomButton = ({ isUserInRoom, userDetails }) => {
  const createNewRoomHandler = () => {
    roomHandler.createNewRoom();
  };

  return (
    <div>
      {userDetails && (
        <Button
          disabled={isUserInRoom}
          onClick={createNewRoomHandler}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            margin: 0,
            padding: 0,
            minWidth: 0,
            marginTop: "10px",
            color: "white",
            backgroundColor: "#5865F2",
          }}
        >
          <AddIcon />
        </Button>
      )}
    </div>
  );
};

const mapStoreStateToProps = ({ auth }) => {
  return {
    ...auth,
  };
};

export default connect(mapStoreStateToProps)(CreateRoomButton);
