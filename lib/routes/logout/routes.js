import { badImplementation } from '@utils/responseInterceptors';
import { supabaseLogout } from '@services/supabaseAuth';
import { AUTH_OPT, LOGOUT_PATH, METHODS, SB_ERROR } from '@utils/constants';
import { trackLogout } from '@analytics/tracker';
import BEARER  from '@root/lib/schema/bearerHeader';
import authMiddleware  from '@root/lib/middlewares/auth';

export default [
  {
    method: METHODS.POST,
    path: LOGOUT_PATH,
    handler: async (request, h) => {
      try {
        await supabaseLogout({ accessToken: request.app.accessToken });
        trackLogout({ userId: request.app.user.id });
      } catch (error) {
        request.log('error', error);
        throw badImplementation(SB_ERROR);
      }

      return h.response().code(204);
    },
    options: {
      description: AUTH_OPT.LOGOUT_OPT.description,
      notes: AUTH_OPT.LOGOUT_OPT.notes,
      tags: AUTH_OPT.LOGOUT_OPT.tags,
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
      },
    },
  },
];
