import Joi from 'joi';
import { badGateway } from '@hapi/boom';
import { unauthorized } from '@utils/responseInterceptors';
import searchSongsFromItunes from '@daos/itunesDao';
import { getSupabaseUserFromToken } from '@services/supabaseAuth';

const authorizationHeaderSchema = Joi.string().pattern(/^Bearer\s+\S+$/i).required();

export default [
  {
    method: 'GET',
    path: '/songs',
    options: {
      description: 'Search songs',
      notes: 'Search songs using iTunes API',
      tags: ['api', 'music'],
      auth: false,
      validate: {
        query: Joi.object({
          term: Joi.string().min(1).required(),
          limit: Joi.number().integer().min(1).max(200).default(25),
          offset: Joi.number().integer().min(0).default(0),
          country: Joi.string().default('US'),
        }),
        headers: Joi.object({
          authorization: authorizationHeaderSchema,
        }).unknown(),
      },
    },
    handler: async (request, h) => {
      try {
        const { authorization: authHeader } = request.headers;
        const match = (authHeader || '').match(/^Bearer\s+(.+)$/i);
        const token = match && match[1];

        if (!token) {
          throw unauthorized('Access denied. Unauthorized user.');
        }

        try {
          const user = await getSupabaseUserFromToken({ accessToken: token });
          request.app.user = user;
        } catch (error) {
          request.log('error', error);
          throw unauthorized('Access denied. Unauthorized user.');
        }

        const { term, limit, offset, country } = request.query;
        console.log(`Searching for songs with term: ${term} and limit: ${limit} offset: ${offset}`);
        const result = await searchSongsFromItunes({ term, limit, offset, country });

        const items = result || [];
        const nextOffset = items.length === limit ? offset + items.length : null;

        const response = h.response(items);
        response.header('x-limit', String(limit));
        response.header('x-offset', String(offset));
        response.header('x-result-count', String(items.length));
        if (nextOffset !== null) response.header('x-next-offset', String(nextOffset));

        return response;
      } catch (error) {
        request.log('error', error);
        console.log("Error generated", error);
        throw badGateway('Music service unavailable');
      }
    }
  }
];
