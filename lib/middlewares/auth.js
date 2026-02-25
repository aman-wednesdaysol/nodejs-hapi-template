import { unauthorized } from '@utils/responseInterceptors';
import { getSupabaseUserFromToken } from '@services/supabaseAuth';
import { BEARER_REGEX } from '@utils/constants';

const authMiddleware = async (request, h) => {
  const { authorization: authHeader } = request.headers;
  const match = (authHeader || '').match(BEARER_REGEX);
  const token = match && match[1];

  if (!token) {
    throw unauthorized('Access denied. Unauthorized user.');
  }

  try {
    const user = await getSupabaseUserFromToken({ accessToken: token });
    request.app.user = user;
    request.app.accessToken = token;
  } catch (error) {
    request.log('error', error);
    throw unauthorized('Access denied. Unauthorized user.');
  }

  return h.continue;
};

export default authMiddleware;