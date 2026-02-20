import { badImplementation } from '@utils/responseInterceptors';
import { supabaseSignupWithPassword } from '@services/supabaseAuth';
import payloadSchema from "@root/lib/schema/signup"
import { SB_ERROR } from '@utils/constants';
import { trackSignup } from '@analytics/tracker';

export default [
  {
    method: 'POST',
    path: '/',
    handler: async (request) => {
      const { email, password } = request.payload;

      try {
        const data = await supabaseSignupWithPassword({ email, password });
        trackSignup({ userId: data.user.id, email });
        return data;
      } catch (error) {
        request.log('error', error);
        throw badImplementation(SB_ERROR);
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

