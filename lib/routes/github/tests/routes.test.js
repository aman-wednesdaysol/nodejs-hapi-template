/* global server */
import axios from 'axios';

jest.mock('axios');

describe('/github route tests', () => {
  beforeEach(() => {
    const { __setupMocks } = require('@services/circuitbreaker');
    __setupMocks(async (query) => {
      try {
        return await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=2`);
      } catch (err) {
        return `Error fetching repos from github. ${err.message || err}`;
      }
    });
  });

  it('respond with status 200 and correct message when CB is closed', async () => {
    const data = { data: 'this is fine' };
    axios.get.mockResolvedValueOnce({ data });

    const res = await server.inject({
      method: 'GET',
      url: '/github?repo=react-template',
    });
    expect(res.statusCode).toBe(200);
  });

  it('respond with status 424 and an error message when CB is open', async () => {
    axios.get.mockRejectedValueOnce(new Error('Github API is down.'));

    const res = await server.inject({
      method: 'GET',
      url: '/github?repo=react-template',
    });

    expect(res.statusCode).toBe(424);
  });
});
