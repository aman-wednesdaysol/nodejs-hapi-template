const { init } =  require('@root/lib/testServer');

jest.mock('@services/supabaseAuth', () => ({
  supabaseLoginWithPassword: jest.fn(),
}));

const { supabaseLoginWithPassword } = require('@services/supabaseAuth');

const payload = {
  email: 'aman.kumar@wednesday.is',
  password: 'aman.kumar@wednesday.is',
};

describe('/login route tests', () => {
  let server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should login with Supabase and return access token', async () => {
    supabaseLoginWithPassword.mockResolvedValueOnce({
      access_token: 'token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'refresh',
      user: { id: 'user-id' },
    });

    const res = await server.inject({
      method: 'POST',
      url: '/login',
      payload,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.result.access_token).toEqual('token');
    expect(res.result.user.id).toEqual('user-id');
  });

  it('should return 500 if Supabase login fails', async () => {
    supabaseLoginWithPassword.mockRejectedValueOnce(new Error('fail'));

    const res = await server.inject({
      method: 'POST',
      url: '/login',
      payload,
    });

    expect(res.statusCode).toEqual(500);
  });
});

