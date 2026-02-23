import Hapi from '@hapi/hapi';
import path from 'path';
import { camelCase, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep';
import hapiSwaggerUI from 'hapi-swaggerui';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import rateLimiter from 'hapi-rate-limit';
import rTracer from 'cls-rtracer';

import cors from 'hapi-cors';
import { shutdownAnalytics } from '@analytics/client';
import serverConfig from '@config/server';
import { isTestEnv, logger } from '@utils';
import loadRoutes from '@plugins/loadRoutes';
import Pack from './package.json';

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let server;

export const initServer = async () => {
  // eslint-disable-next-line global-require
  require('@utils/configureEnv');
  server = Hapi.server(serverConfig);

  // Register hapi swagger plugin
  await server.register([
    inert,
    vision,
    {
      plugin: hapiSwaggerUI,
      options: {
        documentationPage: true,
        swaggerUI: true,
        auth: false,
        templates: path.join(
          __dirname,
          '../node_modules/hapi-swaggerui/templates'
        ),
        info: {
          title: 'Node Hapi Template API documentation',
          version: Pack.version,
        },
        grouping: 'tags',
        tags: [
          {
            name: 'health-check',
            description: 'Health check endpoint',
          },
          {
            name: 'music',
            description: 'Music related endpoints',
          },
          {
            name: 'music-library',
            description: 'Music library related endpoints',
          },
        ],
      },
    },
  ]);

  await server.register({
    plugin: rTracer.hapiPlugin,
  });

  // Register Wurst plugin
  await loadRoutes.register(server, {
    routes: '**/routes.js',
      cwd: path.resolve(process.cwd(), 'lib/routes'),

    log: true,
    ignore: '**/routes.test.js',
  });

  // Register cors plugin
  await server.register({
    plugin: cors,
    options: {
      origins: ['http://localhost:3000'],
    },
  });

  // Register rate limiter plugin
  await server.register({
    plugin: rateLimiter,
  });

  await server.start();

  const onPreHandler = function (request, h) {
    const requestQueryParams = request.query;
    const requestPayload = request.payload;
    request.query = mapKeysDeep(requestQueryParams, (keys) => camelCase(keys));
    request.payload = mapKeysDeep(requestPayload, (keys) => camelCase(keys));
    return h.continue;
  };

  const onPreResponse = function (request, h) {
    const { response } = request;
    const responseSource = response.source;
    // hack for hapi-swagger
    if (!["/documentation", "/swaggerui/"].map(p => p.includes(request.path))) {
      response.source = mapKeysDeep(responseSource, (keys) => snakeCase(keys));
      if (response.header) {
        const requestId = rTracer.id();
        response.header('x-request-id', requestId);
        logger().info('API Success: ', response.source);
      }
    }


    return h.continue;
  };

  const onRequest = (request, h) => {
    const { path: requestPath } = request;
    const { info } = request;
    const { query } = request;

    const requestDetails = {
      path: requestPath,
      info,
      query,
    };

    logger().info('Request Recieved: ', requestDetails);
    return h.continue;
  };

  server.ext('onRequest', onRequest);
  server.ext('onPreHandler', onPreHandler);
  server.ext('onPreResponse', onPreResponse);

  // eslint-disable-next-line no-console
  logger().info('Server running on: ', server.info.uri);


  server.events.on('request', (_, error) => {
    if (error) {
      logger().info('API Failure: ', { error });
      // eslint-disable-next-line no-console
      logger().info(error);
    }
  });

  return true;
};

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  logger().info(err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger().info('Shutting down gracefully...');
  await shutdownAnalytics();
  process.exit(0);
});

if (!isTestEnv()) {
  logger().info('Initializing the server...');
  initServer();
}
