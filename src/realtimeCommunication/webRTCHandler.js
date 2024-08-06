import store from "../store/store";
import { setLocalStream, setRemoteStreams } from "../store/actions/roomActions";
import * as socketConnection from "./socketConnection";
import SimplePeer from "simple-peer";

const getConfiguration = () => {
  const turnIceServers = null;

  if (turnIceServers) {
    // TODO use TURN server credentials
  } else {
    console.warn("Using only STUN server");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

const onlyAudioConstraints = {
  audio: true,
  video: false,
};

const defaultConstraints = {
  video: true,
  audio: true,
};

export const getLocalStreamPreview = (onlyAudio = false, callbackFunc) => {
  const constraints = onlyAudio ? onlyAudioConstraints : defaultConstraints;

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      callbackFunc();
    })
    .catch((err) => {
      console.log(err);
      console.log("Cannot get an access to local stream");
    });
};

let peers = {};

export const prepareNewPeerConnection = (
  connUserSocketId,
  isInitiator,
  username,
  userId
) => {
  console.log("Preparing new peer connection", {
    connUserSocketId,
    username,
    isInitiator,
    userId,
  });

  const localStream = store.getState().room.localStream;

  if (isInitiator) {
    console.log("preparing new peer connection as initiator");
  } else {
    console.log("preparing new peer connection as not initiator");
    console.log("localStream", store.getState().room);
  }
  peers[connUserSocketId] = new SimplePeer({
    initiator: isInitiator,
    stream: localStream,
    config: getConfiguration(),
  });
  peers[connUserSocketId].on("signal", (data) => {
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };

    socketConnection.signalPeerData(signalData);
    console.log(signalData);
    // TODO
    // pass signaling data to other user
    /* socketConnection.signalPeerData(signalData); */
  });

  peers[connUserSocketId].on("stream", (remoteStream) => {
    console.log("remote stream came from other user");
    console.log("direct connection has been established", remoteStream);
    const newRemoteStream = {
      connUserSocketId: connUserSocketId,
      username: username,
      userId: userId,
      mediaStream: remoteStream, // Assurez-vous de stocker l'objet MediaStream sous 'mediaStream'
      isMuted: store.getState().room.micStatuses[userId] || false,
    };
    addNewRemoteStream(newRemoteStream);
    console.log("mcStatus", store.getState().room.micStatuses[userId]);
  });
};

export const handleSignalingData = (data) => {
  const { connUserSocketId, signal } = data;

  if (peers[connUserSocketId]) {
    peers[connUserSocketId].signal(signal);
  }
};

const addNewRemoteStream = (remoteStream) => {
  const remoteStreams = store.getState().room.remoteStreams;
  const newRemoteStreams = [...remoteStreams, remoteStream];
  console.log("store", store.getState().room.remoteStreams);
  console.log("Dispatching setRemoteStreams with", newRemoteStreams);

  store.dispatch(setRemoteStreams(newRemoteStreams));
};

export const closeAllConnections = () => {
  Object.entries(peers).map((mappedObject) => {
    const connUserSocketId = mappedObject[0];
    if (peers[connUserSocketId]) {
      peers[connUserSocketId].destroy();
      delete peers[connUserSocketId];
    }
  });
};

export const handleParticipantLeftRoom = (data) => {
  if (!data || !data.connUserSocketId) {
    console.error("connUserSocketId non défini dans les données reçues.", data);
    return;
  }

  const { connUserSocketId } = data;

  if (peers[connUserSocketId]) {
    peers[connUserSocketId].destroy();
    delete peers[connUserSocketId];
  }

  const remoteStreams = store.getState().room.remoteStreams;

  const newRemoteStreams = remoteStreams.filter((remoteStream) => {
    return remoteStream.connUserSocketId !== connUserSocketId;
  });

  console.log("newR", newRemoteStreams);

  store.dispatch(setRemoteStreams(newRemoteStreams));
};

export const switchOutgoingTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
};
