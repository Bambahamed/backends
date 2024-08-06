import {
  setOpenRoom,
  setRoomDetails,
  setActiveRooms,
  setLocalStream,
  setRemoteStreams,
  setScreenSharingStream,
  setIsUserJoinedWithOnlyAudio,
  setMicStatus,
} from "../store/actions/roomActions";
import store from "../store/store";
import * as socketConnection from "./socketConnection";
import * as webRTCHandler from "./webRTCHandler";

export const createNewRoom = () => {
  const successCallbackFunc = () => {
    store.dispatch(setOpenRoom(true, true));
    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinedWithOnlyAudio(audioOnly));
    socketConnection.createNewRoom();
  };
  const audioOnly = store.getState().room.audioOnly;
  webRTCHandler.getLocalStreamPreview(audioOnly, successCallbackFunc);
};

export const newRoomCreated = (data) => {
  const { roomDetails } = data;

  store.dispatch(setRoomDetails(roomDetails));
};

export const updateActiveRooms = (data) => {
  const { activeRooms } = data;

  const friends = store.getState().friends.friends;
  const rooms = [];

  activeRooms.forEach((room) => {
    const userId = store.getState().auth.userDetails._id;
    const isRoomCreateByMe = room.roomCreator.userId === userId;

    if (isRoomCreateByMe) {
      rooms.push({ ...room, creatorUsername: "Me" });
    } else {
      friends.forEach((f) => {
        if (f.id === room.roomCreator.userId) {
          rooms.push({ ...room, creatorUsername: f.username });
        }
      });
    }
  });
  console.log("room", rooms);
  store.dispatch(setActiveRooms(rooms));
};

export const joinRoom = (roomId) => {
  console.log(roomId);

  const successCallbackFunc = () => {
    store.dispatch(setRoomDetails({ roomId }));

    store.dispatch(setOpenRoom(false, true));
    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinedWithOnlyAudio(audioOnly));

    socketConnection.joinRoom({ roomId });
    console.log(`Rejoindre la salle : ${roomId}`);
  };

  const audioOnly = store.getState().room.audioOnly;

  webRTCHandler.getLocalStreamPreview(audioOnly, successCallbackFunc);
};

export const leaveRoom = () => {
  const roomId = store.getState().room.roomDetails.roomId;
  const state = store.getState();
  const localStream = state.room.localStream;

  console.log("state", state);

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setLocalStream(null));
  }

  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    screenSharingStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setScreenSharingStream(null));
  }

  store.dispatch(setRemoteStreams([]));
  // webRTCHandler.closeAllConnections();
  webRTCHandler.handleParticipantLeftRoom({});
  socketConnection.leaveRoom({ roomId });
  store.dispatch(setRoomDetails(null));
  store.dispatch(setOpenRoom(false, false));
  console.log("mic");
};

export const closeRooms = () => {
  const roomId = store.getState().room.roomDetails.roomId;
  const state = store.getState();
  const localStream = state.room.localStream;
  console.log("state", state);

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setLocalStream(null));
  }

  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    screenSharingStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setScreenSharingStream(null));
  }

  store.dispatch(setRemoteStreams([]));
  webRTCHandler.closeAllConnections();
  socketConnection.leaveRoom({ roomId });
  store.dispatch(setRoomDetails(null));
  store.dispatch(setOpenRoom(false, false));
};
