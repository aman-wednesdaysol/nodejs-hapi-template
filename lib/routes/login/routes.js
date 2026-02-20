import { badImplementation } from '@utils/responseInterceptors';
import { supabaseLoginWithPassword } from '@services/supabaseAuth';
import payloadSchema  from '@root/lib/schema/login';
import { SB_ERROR } from '@utils/constants';


export default [
  {
    method: 'POST',
    path: '/',
    handler: async (request) => {
      const { email, password } = request.payload;

      try {
        const data = await supabaseLoginWithPassword({ email, password });
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
      description: 'login',
      notes: 'API to login and create access token',
      tags: ['api', 'auth'],
      plugins: {
        'hapi-rate-limit': {
          userPathLimit: 5,
          expiresIn: 60000,
        },
      },
      auth: false,
      validate: {
        payload: payloadSchema,
      },
    },
  },
];
