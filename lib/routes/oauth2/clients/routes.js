import { badData } from '@utils/responseInterceptors';
import { createOauthClient } from '@daos/oauthClientsDao';
import payloadSchema from '@root/lib/schema/oauth2Clients';

export default [
  {
    method: 'POST',
    path: '/',
    options: {
      description: 'generate oauth client',
      notes: 'POST Oauth Client API',
      tags: ['api', 'oauth2-clients'],
      plugins: {
        'hapi-rate-limit': {
          userPathLimit: 5,
          expiresIn: 60000,
        },
      },
      validate: {
        payload: payloadSchema,
      },
    },
    handler: (request) => {
      const { scope, resources, grantType, clientId, clientSecret } =
        request.payload;
      return createOauthClient({
        clientId,
        clientSecret,
        grantType,
        scope,
        resources,
      }).catch((e) => badData(`Erorr while creating entity: ${e.message}`));
    },
  },
];
