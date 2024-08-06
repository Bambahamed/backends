import React from "react";
import { styled } from "@mui/system";
import MessagesHeader from "./MessagesHeader";
import { connect } from "react-redux";
import Message from "./Message";
import DateSeparator from "./DateSeparator";

const MainContainer = styled("div")({
  height: "calc(100% - 60px)",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const convertDateToHumanReadable = (date, format) => {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };

  return format.replace(/mm|dd|yy|yyyy/gi, (matched) => map[matched]);
};

const Messages = ({ chosenChatDetails, messages }) => {
  console.log(chosenChatDetails.id);

  return (
    <MainContainer>
      <MessagesHeader name={chosenChatDetails?.name} />
      {messages.map((message, index) => {
        const sameAuthor =
          index > 0 &&
          messages[index].author._id === messages[index - 1].author._id;

        const sameDay =
          index > 0 &&
          convertDateToHumanReadable(new Date(message.date), "dd/mm/yy") ===
            convertDateToHumanReadable(
              new Date(messages[index - 1].date),
              "dd/mm/yy"
            );

        const date = new Date(message.date);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const fullDate = `${hours}:${formattedMinutes}`;

        return (
          <div key={message._id} style={{ width: "100%", marginTop: "10px" }}>
            {(!sameDay || index === 0) && (
              <DateSeparator
                date={convertDateToHumanReadable(
                  new Date(message.date),
                  "dd/mm/yy"
                )}
              />
            )}
            <Message
              content={message.content}
              username={message.author.username}
              sameAuthor={sameAuthor}
              date={convertDateToHumanReadable(
                new Date(message.date),
                "dd/mm/yy"
              )}
              sameDay={sameDay}
              isCurrentUser={message.author._id === chosenChatDetails.id}
              fullDate={fullDate}
            />
          </div>
        );
      })}
    </MainContainer>
  );
};

const mapStoreStateToProps = ({ chat }) => {
  return {
    ...chat,
  };
};

export default connect(mapStoreStateToProps)(Messages);
