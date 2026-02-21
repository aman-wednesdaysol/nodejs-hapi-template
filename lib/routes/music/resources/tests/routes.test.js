import axios from 'axios';

const { init } =  require('@root/lib/testServer');  

jest.mock('axios');
jest.mock('@services/supabaseAuth', () => ({
  getSupabaseUserFromToken: jest.fn(),
}));

const { getSupabaseUserFromToken } = require('@services/supabaseAuth');

describe('music/resources/songs route tests', () => {
  let server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /music/resources/songs', () => {
    const authHeader = { authorization: 'Bearer token' };

    beforeEach(() => {
      getSupabaseUserFromToken.mockResolvedValue({ id: 'user-id' });
    });

    it('Should return 200 with valid term', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          results: [
            {
              trackId: 1,
              trackName: 'Song',
              artistName: 'Artist',
              collectionName: 'Album',
              previewUrl: 'https://example.com',
              artworkUrl100: 'https://example.com/img.jpg',
            },
          ],
        },
      });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=drake',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(200);
    });

    it('Should return JSON content type', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=drake',
        headers: authHeader,
      });

      expect(res.headers['content-type']).toContain('application/json');
    });

    it('Should return an array in response body', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=drake',
        headers: authHeader,
      });

      const payload = JSON.parse(res.payload);
      expect(Array.isArray(payload)).toBe(true);
    });

    it('Should return 400 if term is missing', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(400);
    });

    it('Should return 400 if term is empty', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(400);
    });

    it('Should return empty array if no songs found', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=asldkfjalskdfj',
        headers: authHeader,
      });

      const payload = JSON.parse(res.payload);

      expect(res.statusCode).toEqual(200);
      expect(payload).toEqual([]);
    });

    it('Should handle special characters in term', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=drake%20feat',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(200);
    });

    it('Should return 404 for unsupported method', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/music/resources/songs',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(404);
    });

    it('Should return 502 when iTunes service fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('upstream failed'));

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs?term=drake',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(502);
    });
  });

  describe('GET /music/resources/songs/{trackId}', () => {
    const authHeader = { authorization: 'Bearer token' };

    beforeEach(() => {
      getSupabaseUserFromToken.mockResolvedValue({ id: 'user-id' });
    });

    it('Should return 200 with song details for valid trackId', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          results: [
            {
              trackId: 123,
              trackName: 'Song',
              artistName: 'Artist',
              collectionName: 'Album',
              previewUrl: 'https://example.com/preview',
              artworkUrl100: 'https://example.com/img.jpg',
              trackPrice: 1.29,
              currency: 'USD',
              releaseDate: '2024-01-01T00:00:00Z',
              primaryGenreName: 'Pop',
              trackTimeMillis: 210000,
              trackViewUrl: 'https://music.apple.com/song/123',
            },
          ],
        },
      });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs/123',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(200);
      const payload = JSON.parse(res.payload);
      expect(payload.track_id).toEqual(123);
      expect(payload.track_name).toEqual('Song');
      expect(payload.artist_name).toEqual('Artist');
      expect(payload.genre).toEqual('Pop');
    });

    it('Should return 404 when song is not found', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs/999999999',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(404);
    });

    it('Should return 400 for invalid trackId', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs/abc',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(400);
    });

    it('Should return 502 when iTunes service fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('upstream failed'));

      const res = await server.inject({
        method: 'GET',
        url: '/music/resources/songs/123',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(502);
    });
  });
});
