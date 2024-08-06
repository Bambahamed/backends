import React from "react";
import { styled } from "@mui/system";
import { connect } from "react-redux";
import Video from "./Video";

const MainContainer = styled("div")({
  height: "100%",
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
});

const VideosContainer = ({
  localStream,
  remoteStreams,
  screenSharingStream,
  userDetails,
  micStatuses,
}) => {
  console.log("userDetails", userDetails);
  console.log("remote", remoteStreams);

  console.log("isMic", micStatuses);
  return (
    <MainContainer>
      <Video
        stream={screenSharingStream ? screenSharingStream : localStream}
        isLocalStream
        username={userDetails.username}
        userId={userDetails._id} // Pass userId
        isMicMuted={micStatuses[userDetails._id]} // Pass the microphone status for local user
      />

      {remoteStreams.map((stream) => (
        <Video
          stream={stream.mediaStream}
          key={stream.connUserSocketId}
          username={stream.username}
          userId={stream.userId} // Pass userId for remote users
          isMicMuted={stream.isMuted} // Pass the microphone status for remote user
        />
      ))}
    </MainContainer>
  );
};

const mapStoreStateToProps = ({ room, auth }) => {
  return {
    ...room,
    ...auth,
  };
};

export default connect(mapStoreStateToProps)(VideosContainer);
