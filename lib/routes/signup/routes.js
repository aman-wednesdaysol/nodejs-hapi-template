import { badImplementation } from '@utils/responseInterceptors';
import { supabaseSignupWithPassword } from '@services/supabaseAuth';
import payloadSchema from "@root/lib/schema/signup"
import { AUTH_OPT, METHODS, SB_ERROR,  SIGNUP_PATH } from '@utils/constants';
import { trackSignup } from '@analytics/tracker';

export default [
  {
    method: METHODS.POST,
    path: SIGNUP_PATH,
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
      description: AUTH_OPT.SIGNUP_OPT.description,
      notes: AUTH_OPT.SIGNUP_OPT.notes,
      tags: AUTH_OPT.SIGNUP_OPT.tags,
      auth: false,
      validate: {
        payload: payloadSchema,
      },
    },
  },
];

