import { badImplementation } from '@utils/responseInterceptors';
import { supabaseLoginWithPassword } from '@services/supabaseAuth';
import payloadSchema  from '@root/lib/schema/login';
import { AUTH_OPT, HAPI_RATE_LIMIT_OPTIONS, LOGIN_PATH, METHODS, RATE_LIMIT_OPTIONS, SB_ERROR } from '@utils/constants';
import { trackLogin } from '@analytics/tracker';


export default [
  {
    method: METHODS.POST,
    path: LOGIN_PATH,
    handler: async (request) => {
      const { email, password } = request.payload;

      try {
        const data = await supabaseLoginWithPassword({ email, password });
        trackLogin({ userId: data.user.id, email });
        return {
          accessToken: data.access_token,
          tokenType: data.token_type,
          expiresIn: data.expires_in,
          refreshToken: data.refresh_token,
          user: data.user,
        };
      } catch (error) {
        request.log('error', error);
        throw badImplementation(SB_ERROR);
      }
    },
    options: {
      description: AUTH_OPT.LOGIN_OPT.description,
      notes: AUTH_OPT.LOGIN_OPT.notes,
      tags: AUTH_OPT.LOGIN_OPT.tags,
      plugins: {
        [HAPI_RATE_LIMIT_OPTIONS]: {
         ...RATE_LIMIT_OPTIONS
        },
      },
      auth: false,
      validate: {
        payload: payloadSchema,
      },
    },
  },
];
