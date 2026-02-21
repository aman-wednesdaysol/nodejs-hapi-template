import Joi from 'joi';
import { badImplementation } from '@utils/responseInterceptors';
import { supabaseLoginWithPassword } from '@services/supabaseAuth';

const payloadSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: true } }).required(),
  password: Joi.string().min(6).required(),
}).options({ stripUnknown: true });

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
        throw badImplementation('Error while logging in with Supabase');
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
