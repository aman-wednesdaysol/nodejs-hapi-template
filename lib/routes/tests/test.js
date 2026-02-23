/* global server */

describe('health check', () => {
  it('should return 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toEqual(200);
  });
});
