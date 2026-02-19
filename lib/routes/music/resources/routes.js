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
          limit: Joi.number().min(1).max(50).default(25),
          country: Joi.string().default('US')
        })
      }
    },
    handler: async (request) => {
      try {
        const { term, limit, country } = request.query;
        console.log(`Searching for songs with term: ${term} and limit: ${limit}`);
        const result = await searchSongsFromItunes({ term, limit, country });

        return result || [];
      } catch (error) {
        request.log('error', error);
        console.log("Error generated", error);
        throw badGateway('Music service unavailable');
      }
    }
  }
];
