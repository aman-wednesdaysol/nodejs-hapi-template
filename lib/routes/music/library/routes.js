import { badGateway, conflict } from '@hapi/boom';
import { getLikedSongs, likeSong, unlikeSong } from '@daos/likedSongsDao';
import {
  likePayloadSchema,
  unlikeParamsSchema,
} from '@root/lib/schema/likedSongs';
import BEARER from '@root/lib/schema/bearerHeader';
import authMiddleware from '@root/lib/middlewares/auth';
import { trackLibraryViewed, trackSongLiked, trackSongUnliked } from '@analytics/tracker';
import { LIBRARY_PATH, LIKE_SONG_PATH, METHODS, MUSIC_OPT, SERVICE_UNAVAILABLE_MESSAGE, UNLIKE_SONG_PATH } from '@utils/constants';

export default [
  {
    method: METHODS.GET,
    path: LIBRARY_PATH,
    options: {
      description: MUSIC_OPT.LIBRARY_OPT.description,
      notes: MUSIC_OPT.LIBRARY_OPT.notes,
      tags: MUSIC_OPT.LIBRARY_OPT.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
      },
    },
    handler: async (request) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        const songs = await getLikedSongs({ userId, accessToken });
        trackLibraryViewed({ userId });
        return songs;
      } catch (error) {
        request.log('error', error);
        throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
      }
    },
  },
  {
    method: METHODS.POST,
    path: LIKE_SONG_PATH,
    options: {
      description: MUSIC_OPT.LIBRARY_OPT.description,
      notes: MUSIC_OPT.LIBRARY_OPT.notes,
      tags: MUSIC_OPT.LIBRARY_OPT.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
        payload: likePayloadSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        const song = request.payload;

        const liked = await likeSong({ userId, accessToken, song });
        trackSongLiked({ userId, trackId: song.trackId, trackName: song.trackName, artistName: song.artistName });
        return h.response(liked).code(201);
      } catch (error) {
        request.log('error', error);

        if (error.response && error.response.status === 409) {
          throw conflict('Song is already liked');
        }
        throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
      }
    },
  },
  {
    method: METHODS.DELETE,
    path: UNLIKE_SONG_PATH,
    options: {
      description: MUSIC_OPT.LIBRARY_OPT.description,
      notes: MUSIC_OPT.LIBRARY_OPT.notes,
      tags: MUSIC_OPT.LIBRARY_OPT.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
        params: unlikeParamsSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        const { trackId } = request.params;

        await unlikeSong({ userId, accessToken, trackId });
        trackSongUnliked({ userId, trackId });
        return h.response().code(204);
      } catch (error) {
        request.log('error', error);
        throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
      }
    },
  },
];
