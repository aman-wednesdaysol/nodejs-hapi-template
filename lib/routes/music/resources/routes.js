import { badGateway } from '@hapi/boom';
import searchSongsFromItunes from '@services/itunes/search';
import getSongDetails from '@services/itunes/details';
import BEARER from '@root/lib/schema/bearerHeader';
import { querySchema, trackIdParamsSchema } from '@root/lib/schema/music';
import authMiddleware from '@root/lib/middlewares/auth';
import { trackSongSearched } from '@analytics/tracker';
import {
  METHODS,
  MUSIC_OPT,
  SEARCH_SONGS_PATH,
  SERVICE_UNAVAILABLE_MESSAGE,
  SONG_DETAILS_PATH,
} from '@utils/constants';


export default [
  {
    method: METHODS.GET,
    path: SEARCH_SONGS_PATH,
    options: {
      description: MUSIC_OPT.SEARCH_SONG.description,
      notes: MUSIC_OPT.SEARCH_SONG.notes,
      tags: MUSIC_OPT.SEARCH_SONG.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        query: querySchema,
        headers: BEARER,
      },
    },
    handler: async (request, h) => {
      try {
        const { term, limit, offset, country } = request.query;
        const result = await searchSongsFromItunes({ term, limit, offset, country });

        const items = result || [];
        const nextOffset = items.length === limit ? offset + items.length : null;

        trackSongSearched({ userId: request.app.user.id, term, resultCount: items.length });

        const response = h.response(items);
        response.header('x-limit', String(limit));
        response.header('x-offset', String(offset));
        response.header('x-result-count', String(items.length));
        if (nextOffset !== null) response.header('x-next-offset', String(nextOffset));

        return response;
      } catch (error) {
        request.log('error', error);
        throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
      }
    }
  },
  {
    method: METHODS.GET,
    path: SONG_DETAILS_PATH,
    options: {
      description: MUSIC_OPT.SONG_DETAILS.description,
      notes: MUSIC_OPT.SONG_DETAILS.notes,
      tags: MUSIC_OPT.SONG_DETAILS.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        params: trackIdParamsSchema,
        headers: BEARER,
      },
    },
    handler: async (request) => {
      try {
        const { trackId } = request.params;
        return await getSongDetails({ trackId });
      } catch (error) {
        if (error.isBoom) throw error;
        request.log('error', error);
        throw badGateway(SERVICE_UNAVAILABLE_MESSAGE);
      }
    }
  }
];
