import Qs from 'qs';
import { parse } from 'semver';
import pkg from '../package.json';

const version = parse(pkg.version);

export default {
  app: {
    name: pkg.name,
    docs: pkg.homepage,
    version: pkg.version,
    semver: {
      major: version.major,
      minor: version.minor,
      patch: version.patch,
    },
  },
  host: '0.0.0.0',
  port: process.env.PORT,
  routes: {
    cors: true,
    validate: {
      options: {
        abortEarly: false,
      },
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  query: {
    parser: (query) => Qs.parse(query),
  },
  router: {
    isCaseSensitive: false,
    stripTrailingSlash: true,
  },
};
