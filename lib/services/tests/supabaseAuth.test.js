import axios from 'axios';
import {
  supabaseLoginWithPassword,
  supabaseLogout,
} from '@services/supabaseAuth';

jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

jest.mock('@config/supabase', () => ({
  url: 'https://emwxhdvisuflokvxdilb.supabase.co',
  anonKey: 'b_publishable_nvQaVjzivkVit45xjyc3bQ_GXozq2FC',
}));

describe('supabaseAuth service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login with password', async () => {
    axios.post.mockResolvedValueOnce({
      data: { access_token: 'token' },
    });

    const res = await supabaseLoginWithPassword({
      email: 'test@email.com',
      password: 'password',
    });

    expect(res.access_token).toEqual('token');
  });

  it('should logout', async () => {
    axios.post.mockResolvedValueOnce({});

    await supabaseLogout({ accessToken: 't' });

    expect(axios.post).toHaveBeenCalled();
  });
});