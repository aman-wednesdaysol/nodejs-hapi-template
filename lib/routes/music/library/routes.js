import { badGateway, conflict } from '@hapi/boom';
import { getLikedSongs, likeSong, unlikeSong } from '@daos/likedSongsDao';
import {
  likePayloadSchema,
  unlikeParamsSchema,
} from '@root/lib/schema/likedSongs';
import BEARER from '@root/lib/schema/bearerHeader';
import authMiddleware from '@root/lib/middlewares/auth';

export default [
  {
    method: 'GET',
    path: '/',
    options: {
      description: 'Get liked songs',
      notes: 'Returns all songs liked by the authenticated user',
      tags: ['api', 'music-library'],
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
      },
    },
    handler: async (request) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        return await getLikedSongs({ userId, accessToken });
      } catch (error) {
        request.log('error', error);
        throw badGateway('Failed to fetch liked songs');
      }
    },
  },
  {
    method: 'POST',
    path: '/like',
    options: {
      description: 'Like a song',
      notes: 'Add a song to the user liked songs library',
      tags: ['api', 'music-library'],
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
        payload: likePayloadSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        const song = request.payload;

        const liked = await likeSong({ userId, accessToken, song });
        return h.response(liked).code(201);
      } catch (error) {
        request.log('error', error);

        if (error.response && error.response.status === 409) {
          throw conflict('Song is already liked');
        }
        throw badGateway('Failed to like song');
      }
    },
  },
  {
    method: 'DELETE',
    path: '/unlike/{trackId}',
    options: {
      description: 'Unlike a song',
      notes: 'Remove a song from the user liked songs library',
      tags: ['api', 'music-library'],
      auth: false,
      pre: [{ method: authMiddleware }],
      validate: {
        headers: BEARER,
        params: unlikeParamsSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { id: userId } = request.app.user;
        const { accessToken } = request.app;
        const { trackId } = request.params;

        await unlikeSong({ userId, accessToken, trackId });
        return h.response().code(204);
      } catch (error) {
        request.log('error', error);
        throw badGateway('Failed to unlike song');
      }
    },
  },
];
