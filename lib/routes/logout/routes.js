import { badImplementation } from '@utils/responseInterceptors';
import { supabaseLogout } from '@services/supabaseAuth';
import { SB_ERROR } from '@utils/constants';
import BEARER  from '@root/lib/schema/bearerHeader';
import authMiddleware  from '@root/lib/middlewares/auth';

export default [
  {
    method: 'POST',
    path: '/',
    handler: async (request, h) => {
      try {
        await supabaseLogout({ accessToken: request.app.accessToken });
      } catch (error) {
        request.log('error', error);
        throw badImplementation(SB_ERROR);
      }

      return h.response().code(204);
    },
    options: {
      description: 'logout',
      notes: 'API to logout and revoke access token',
      tags: ['api', 'auth'],
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
      },
    },
  },
];
