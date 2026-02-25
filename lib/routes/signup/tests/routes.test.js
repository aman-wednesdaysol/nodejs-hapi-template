const {init} = require("@root/lib/testServer")

jest.mock('@services/supabaseAuth', () => ({
  supabaseSignupWithPassword: jest.fn(),
}));

const { supabaseSignupWithPassword } = require('@services/supabaseAuth');

describe('/signup route tests', () => {
  let server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should signup with Supabase and return response', async () => {
    supabaseSignupWithPassword.mockResolvedValueOnce({
      user: { id: 'user-id', email: 'aman.kumar@wednesday.is' },
    });

    const res = await server.inject({
      method: 'POST',
      url: '/signup',
      payload: {
        email: 'aman.kumar@wednesday.is',
        password: 'password123',
      },
    });

    expect(res.statusCode).toEqual(200);
    expect(res.result.user.id).toEqual('user-id');
  });

  it('should return 500 if Supabase signup fails', async () => {
    supabaseSignupWithPassword.mockRejectedValueOnce(new Error('fail'));

    const res = await server.inject({
      method: 'POST',
      url: '/signup',
      payload: {
        email: 'aman.kumar@wednesday.is',
        password: 'password123',
      },
    });

    expect(res.statusCode).toEqual(500);
  });
});

