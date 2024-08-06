import { roomActions } from "../actions/roomActions";

const initState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails: null,
  activeRooms: [],
  localStream: null,
  remoteStreams: [],
  audioOnly: false,
  screenSharingStream: null,
  isScreenSharingActive: false,
  isUserJoinedWithOnlyAudio: false,
  micStatuses: {},
};

const roomReducer = (state = initState, action) => {
  switch (action.type) {
    case roomActions.OPEN_ROOM:
      return {
        ...state,
        isUserInRoom: action.isUserInRoom,
        isUserRoomCreator: action.isUserRoomCreator,
      };
    case roomActions.SET_ROOM_DETAILS:
      return {
        ...state,
        roomDetails: action.roomDetails,
      };
    case roomActions.SET_ACTIVE_ROOMS:
      return {
        ...state,
        activeRooms: action.activeRooms,
      };
    case roomActions.SET_LOCAL_STREAM:
      return {
        ...state,
        localStream: action.localStream,
      };
    case roomActions.SET_AUDIO_ONLY:
      return {
        ...state,
        audioOnly: action.audioOnly,
      };
    case roomActions.SET_REMOTE_STREAMS:
      return {
        ...state,
        remoteStreams: action.remoteStreams,
      };
    case roomActions.SET_SCREEN_SHARE_STREAM:
      return {
        ...state,
        screenSharingStream: action.screenSharingStream,
        isScreenSharingActive: action.isScreenSharingActive,
      };
    case roomActions.SET_IS_USER_JOINED_WITH_ONLY_AUDIO:
      return {
        ...state,
        isUserJoinedWithOnlyAudio: action.isUserJoinedWithOnlyAudio,
      };
    /* case roomActions.SET_MIC_STATUS:
      return {
        ...state,
        micStatuses: {
          ...state.micStatuses,
          [action.micStatuses.userId]: action.micStatuses.isMuted,
        },
        // Mettre à jour les remoteStreams
      }; */
    case roomActions.SET_MIC_STATUS:
      const newMicStatuses = {
        ...state.micStatuses,
        [action.micStatuses.userId]: action.micStatuses.isMuted,
      };

      const updatedRemoteStreams = state.remoteStreams.map((stream) => {
        if (stream.userId === action.micStatuses.userId) {
          return {
            ...stream,
            isMuted: action.micStatuses.isMuted,
          };
        }
        return stream;
      });

      return {
        ...state,
        micStatuses: newMicStatuses,
        remoteStreams: updatedRemoteStreams,
      };

    default:
      return state;
  }
};

export default roomReducer;
