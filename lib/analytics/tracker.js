import client from './client';
import EVENTS  from './events';

export const trackLogin = ({ userId, email }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.USER_LOGIN,
    properties: { email },
  });
};

export const trackSignup = ({ userId, email }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.USER_SIGNUP,
    properties: { email },
  });
};

export const trackLogout = ({ userId }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.USER_LOGOUT,
  });
};

export const trackSongSearched = ({ userId, term, resultCount }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.SONG_SEARCHED,
    properties: { term, resultCount },
  });
};

export const trackSongLiked = ({ userId, trackId, trackName, artistName }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.SONG_LIKED,
    properties: { trackId, trackName, artistName },
  });
};

export const trackSongUnliked = ({ userId, trackId }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.SONG_UNLIKED,
    properties: { trackId },
  });
};

export const trackLibraryViewed = ({ userId }) => {
  client.capture({
    distinctId: userId,
    event: EVENTS.LIBRARY_VIEWED,
  });
};
