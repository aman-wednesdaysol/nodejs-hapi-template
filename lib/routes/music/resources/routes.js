import { badGateway } from '@hapi/boom';
import searchSongsFromItunes from '@services/itunes/search';
import getSongDetails from '@services/itunes/details';
import BEARER from '@root/lib/schema/bearerHeader';
import { querySchema, trackIdParamsSchema } from '@root/lib/schema/music';
import authMiddleware from '@root/lib/middlewares/auth';
import { trackSongSearched } from '@analytics/tracker';
import {
  SEARCH_SONGS_DESCRIPTION,
  SEARCH_SONGS_NOTES,
  SEARCH_SONGS_PATH,
  SONG_DETAILS_DESCRIPTION,
  SONG_DETAILS_NOTES,
  SONG_DETAILS_PATH,
} from '@utils/constants';


export default [
  {
    method: 'GET',
    path: SEARCH_SONGS_PATH,
    options: {
      description: SEARCH_SONGS_DESCRIPTION,
      notes: SEARCH_SONGS_NOTES,
      tags: ['api', 'music'],
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
        throw badGateway('Music service unavailable');
      }
    }
  },
  {
    method: 'GET',
    path: SONG_DETAILS_PATH,
    options: {
      description: SONG_DETAILS_DESCRIPTION,
      notes: SONG_DETAILS_NOTES,
      tags: ['api', 'music'],
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
        throw badGateway('Music service unavailable');
      }
    }
  }
];
