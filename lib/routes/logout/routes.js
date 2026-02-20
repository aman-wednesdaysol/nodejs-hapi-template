import Joi from 'joi';
import { badImplementation, unauthorized } from '@utils/responseInterceptors';
import { supabaseLogout } from '@services/supabaseAuth';

const BEARER_REGEX = /^Bearer\s+(.+)$/i;

export default [
  {
    method: 'POST',
    path: '/',
    handler: async (request, h) => {
      const { authorization } = request.headers;
      const match = (authorization || '').match(BEARER_REGEX);
      const token = match && match[1];

      if (!token) {
        throw unauthorized('Access denied. Unauthorized user.');
      }

      try {
        await supabaseLogout({ accessToken: token });
      } catch (error) {
        request.log('error', error);
        throw badImplementation('Error while logging out');
      }

      return h.response().code(204);
    },
    options: {
      description: 'logout',
      notes: 'API to logout and revoke access token',
      tags: ['api', 'auth'],
      auth: false,
      validate: {
        headers: Joi.object({
          authorization: Joi.string().pattern(/^Bearer\s+\S+$/i).required(),
        }).unknown(),
      },
    },
  },
];
