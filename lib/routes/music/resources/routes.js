import Joi from 'joi';
import { badGateway } from '@hapi/boom';
import searchSongsFromItunes from '@daos/itunesDao';

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
        })
      }
    },
    handler: async (request, h) => {
      try {
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
