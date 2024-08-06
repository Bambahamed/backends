import React from "react";
import { styled } from "@mui/system";
import Avatar from "../../../shared/components/Avatar";
import { Typography } from "@mui/material";

const MainContainer = styled("div")(({ isCurrentUser }) => ({
  width: "97%",
  display: "flex",
  marginTop: "10px",
  flexDirection: isCurrentUser ? "row-reverse" : "row",
  alignItems: "flex-start",
  textAlign: isCurrentUser ? "right" : "left",
}));

const AvatarContainer = styled("div")({
  width: "70px",
});

const MessageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const MessageContent = styled("div")(({ isCurrentUser }) => ({
  color: "#DCDDDE",
  backgroundColor: isCurrentUser ? "#0078FF" : "#333333",
  padding: "10px",
  borderRadius: "10px",
  maxWidth: "100%",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
}));

const SameAuthorMessageContent = styled("div")(({ isCurrentUser }) => ({
  color: "#DCDDDE",
  width: "97%",
  textAlign: isCurrentUser ? "right" : "left",
}));

const SameAuthorMessageText = styled("span")(({ isCurrentUser }) => ({
  marginLeft: isCurrentUser ? "0" : "70px",
  marginRight: isCurrentUser ? "70px" : "0",
  display: "inline-block",
  backgroundColor: isCurrentUser ? "#0078FF" : "#333333",
  padding: "10px",
  borderRadius: "10px",
  maxWidth: "60%",
}));

const Message = ({
  content,
  sameAuthor,
  username,
  date,
  sameDay,
  isCurrentUser,
  fullDate,
}) => {
  if (sameAuthor && sameDay) {
    return (
      <SameAuthorMessageContent isCurrentUser={isCurrentUser}>
        <SameAuthorMessageText isCurrentUser={isCurrentUser}>
          {content}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "10px" }}>{fullDate}</span>
          </div>
        </SameAuthorMessageText>
      </SameAuthorMessageContent>
    );
  }
  return (
    <MainContainer isCurrentUser={isCurrentUser}>
      <AvatarContainer>
        <Avatar username={username} />
      </AvatarContainer>
      <MessageContainer>
        <Typography style={{ fontSize: "16px", color: "white" }}>
          {username}
          <span
            style={{ fontSize: "12px", color: "#72767d", marginLeft: "10px" }}
          >
            {date}
          </span>
        </Typography>

        <MessageContent isCurrentUser={isCurrentUser}>
          {content}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "10px" }}>{fullDate}</span>
          </div>
        </MessageContent>
      </MessageContainer>
    </MainContainer>
  );
};

export default Message;
