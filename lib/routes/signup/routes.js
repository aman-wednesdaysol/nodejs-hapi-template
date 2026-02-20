import Joi from 'joi';
import { badImplementation } from '@utils/responseInterceptors';
import { supabaseSignupWithPassword } from '@services/supabaseAuth';

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
        const data = await supabaseSignupWithPassword({ email, password });
        return data;
      } catch (error) {
        request.log('error', error);
        throw badImplementation('Error while signing up with Supabase');
      }
    },
    options: {
      description: 'signup',
      notes: 'API to signup user via Supabase',
      tags: ['api', 'auth'],
      auth: false,
      validate: {
        payload: payloadSchema,
      },
    },
  },
];

