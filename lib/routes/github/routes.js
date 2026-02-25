import newCircuitBreaker from '@services/circuitbreaker';
import fetchReposFromGithub from '@services/github';
import querySchema from '@root/lib/schema/github';

const githubBreaker = newCircuitBreaker(
  fetchReposFromGithub,
  'Error fetching repos from github'
);
export default [
  {
    method: 'GET',
    path: '/',
    options: {
      description: 'Fetch repos from github using a circuit breaker',
      notes: 'Pass through for github API to fetch repos',
      tags: ['api', 'github-circuitbreaker'],
      auth: false,
      validate: {
        query: querySchema,
      },
    },
    handler: async (request, h) => {
      const res = await githubBreaker.fire(request.query.repo);
      if (res.data) {
        return h.response(res.data).code(200);
      }
      return h.response(res).code(424);
    },
  },
];
