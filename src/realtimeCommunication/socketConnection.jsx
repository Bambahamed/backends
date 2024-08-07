import io from "socket.io-client";
import {
  setPendingFriendsInvitations,
  setFriends,
  setOnlineUsers,
} from "../store/actions/friendsActions";
import store from "../store/store";
import { updateDirectChatHistoryIfActive } from "../shared/utils/chat";
import { newRoomCreated, updateActiveRooms } from "./roomHandler";
import * as webRTCHandler from "./webRTCHandler";
import { setMicStatus } from "../store/actions/roomActions";

let socket = null;

export const connectWithSocketServer = (userDetails) => {
  const jwtToken = userDetails.token;

  socket = io("https://backend-vxxw.onrender.com", {
    auth: {
      token: jwtToken,
    },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("successfully connected with socket.io server");
    console.log(socket.id);
  });

  socket.on("friends-invitation", (data) => {
    const { pendingInvitations } = data;
    store.dispatch(setPendingFriendsInvitations(pendingInvitations));
    console.log("invitation", pendingInvitations);
  });

  socket.on("friends-list", (data) => {
    const { friends } = data;
    store.dispatch(setFriends(friends));
  });

  socket.on("online-users", (data) => {
    const { onlineUsers } = data;
    store.dispatch(setOnlineUsers(onlineUsers));
  });

  socket.on("direct-chat-history", (data) => {
    updateDirectChatHistoryIfActive(data);
  });

  socket.on("room-create", (data) => {
    newRoomCreated(data);
  });

  socket.on("active-rooms", (data) => {
    updateActiveRooms(data);
  });
  socket.on("mic-status-update", (data) => {
    const { userId, isMuted } = data;
    // Mettez à jour l'état dans votre store ou état local
    // Par exemple, vous pouvez dispatcher une action Redux ici
    store.dispatch(setMicStatus(userId, isMuted));
  });

  socket.on("conn-prepare", (data) => {
    console.log("prepare for connection", data);
    const { connUserSocketId, username, userId, allUserIds } = data;

    webRTCHandler.prepareNewPeerConnection(
      connUserSocketId,
      false,
      username,
      userId,
      allUserIds
    );
    socket.emit("conn-init", {
      connUserSocketId: connUserSocketId,
      isInitiator: true,
      username,
      userId,
    });
  });

  socket.on("conn-init", (data) => {
    console.log("Received conn-init event", data);
    const { connUserSocketId, username, userId, allUserIds } = data;

    webRTCHandler.prepareNewPeerConnection(
      connUserSocketId,
      true,
      username,
      userId,
      allUserIds
    );
  });

  socket.on("conn-signal", (data) => {
    webRTCHandler.handleSignalingData(data);
    console.log("signal", data);
  });

  socket.on("room-participant-left", (data) => {
    webRTCHandler.handleParticipantLeftRoom(data);
  });
};

export const sendDirectMessage = (data) => {
  console.log(data);
  socket.emit("direct-message", data);
};

export const getDirectChatHistory = (data) => {
  socket.emit("direct-chat-history", data);
};

export const createNewRoom = () => {
  socket.emit("room-create");
};
export const joinRoom = (data) => {
  socket.emit("room-join", data);
};

export const leaveRoom = (data) => {
  socket.emit("room-leave", data);
};

export const signalPeerData = (data) => {
  socket.emit("conn-signal", data);
};

export const emitMicStatus = (userId, isMuted) => {
  socket.emit("mic-status-update", { userId, isMuted });
  store.dispatch(setMicStatus(userId, isMuted));
};
