import axios from 'axios';

const { init } = require('@root/lib/testServer');

jest.mock('axios');
jest.mock('@services/supabaseAuth', () => ({
  getSupabaseUserFromToken: jest.fn(),
}));

const { getSupabaseUserFromToken } = require('@services/supabaseAuth');

describe('music/library route tests', () => {
  let server;
  const authHeader = { authorization: 'Bearer test-token' };
  const mockUser = { id: 'user-uuid-123' };

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getSupabaseUserFromToken.mockResolvedValue(mockUser);
  });

  describe('GET /music/library', () => {
    it('should return 200 with liked songs', async () => {
      axios.get.mockResolvedValueOnce({
        data: [
          {
            track_id: 123,
            track_name: 'Test Song',
            artist_name: 'Test Artist',
            album_name: 'Test Album',
            preview_url: 'https://example.com/preview',
            artwork_url: 'https://example.com/art',
          },
        ],
      });

      const res = await server.inject({
        method: 'GET',
        url: '/music/library',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(200);
    });

    it('should return empty array when no liked songs', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      const res = await server.inject({
        method: 'GET',
        url: '/music/library',
        headers: authHeader,
      });

      const payload = JSON.parse(res.payload);
      expect(res.statusCode).toEqual(200);
      expect(payload).toEqual([]);
    });

    it('should return 400 without auth header', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/music/library',
      });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /music/library/like', () => {
    const validPayload = {
      trackId: 1468910018,
      trackName: 'Señorita',
      artistName: 'Shawn Mendes & Camila Cabello',
      albumName: 'Señorita - Single',
      previewUrl: 'https://example.com/preview.m4a',
      artworkUrl: 'https://example.com/art.jpg',
    };

    it('should return 201 when liking a song', async () => {
      axios.post.mockResolvedValueOnce({
        data: [
          {
            track_id: 1468910018,
            track_name: 'Señorita',
            artist_name: 'Shawn Mendes & Camila Cabello',
            album_name: 'Señorita - Single',
            preview_url: 'https://example.com/preview.m4a',
            artwork_url: 'https://example.com/art.jpg',
          },
        ],
      });

      const res = await server.inject({
        method: 'POST',
        url: '/music/library/like',
        headers: authHeader,
        payload: validPayload,
      });

      expect(res.statusCode).toEqual(201);
    });

    it('should return 400 if trackId is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/music/library/like',
        headers: authHeader,
        payload: { trackName: 'Song', artistName: 'Artist', albumName: 'Album' },
      });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if trackName is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/music/library/like',
        headers: authHeader,
        payload: { trackId: 123, artistName: 'Artist', albumName: 'Album' },
      });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 409 when song is already liked', async () => {
      const conflictError = new Error('Conflict');
      conflictError.response = { status: 409 };
      axios.post.mockRejectedValueOnce(conflictError);

      const res = await server.inject({
        method: 'POST',
        url: '/music/library/like',
        headers: authHeader,
        payload: validPayload,
      });

      expect(res.statusCode).toEqual(409);
    });

    it('should return 502 when supabase is unavailable', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));

      const res = await server.inject({
        method: 'POST',
        url: '/music/library/like',
        headers: authHeader,
        payload: validPayload,
      });

      expect(res.statusCode).toEqual(502);
    });
  });

  describe('DELETE /music/library/unlike/{trackId}', () => {
    it('should return 204 when unliking a song', async () => {
      axios.delete.mockResolvedValueOnce({});

      const res = await server.inject({
        method: 'DELETE',
        url: '/music/library/unlike/1468910018',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(204);
    });

    it('should return 502 when supabase fails', async () => {
      axios.delete.mockRejectedValueOnce(new Error('Network error'));

      const res = await server.inject({
        method: 'DELETE',
        url: '/music/library/unlike/123',
        headers: authHeader,
      });

      expect(res.statusCode).toEqual(502);
    });
  });
});
