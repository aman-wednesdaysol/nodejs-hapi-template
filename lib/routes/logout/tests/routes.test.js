const { init } =  require('@root/lib/testServer');  

jest.mock('@services/supabaseAuth', () => ({
  supabaseLogout: jest.fn(),
  getSupabaseUserFromToken: jest.fn(),
}));

const { supabaseLogout, getSupabaseUserFromToken } = require('@services/supabaseAuth');

describe('/logout route tests', () => {
  let server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should revoke the Supabase token and return 204', async () => {
    getSupabaseUserFromToken.mockResolvedValueOnce({ id: 'user-id' });
    supabaseLogout.mockResolvedValueOnce({});

    const res = await server.inject({
      method: 'POST',
      url: '/logout',
      headers: {
        authorization: 'Bearer token',
      },
    });

    expect(res.statusCode).toEqual(204);
    expect(supabaseLogout).toHaveBeenCalledWith({ accessToken: 'token' });
  });

  it('should return 400 if Authorization header is missing', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/logout',
    });

    expect(res.statusCode).toEqual(400);
  });
});

