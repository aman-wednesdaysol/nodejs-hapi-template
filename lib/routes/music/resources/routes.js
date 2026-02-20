import { badGateway } from '@hapi/boom';
import searchSongsFromItunes from '@services/itunes';
import BEARER  from '@root/lib/schema/bearerHeader';
import querySchema  from '@root/lib/schema/music';
import authMiddleware  from '@root/lib/middlewares/auth';
import { trackSongSearched } from '@analytics/tracker';

export default [
  {
    method: 'GET',
    path: '/songs',
    options: {
      description: 'Search songs',
      notes: 'Search songs using iTunes API',
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
  }
];
