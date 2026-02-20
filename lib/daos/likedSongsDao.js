import axios from 'axios';
import supabaseConfig from '@config/supabase';
import { badImplementation } from '@utils/responseInterceptors';
import {
  buildSupabaseHeaders,
  buildSupabaseInsertHeaders,
} from '@utils/supabaseHeaders';

const TABLE = 'liked_songs';

const assertSupabaseConfigured = () => {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw badImplementation(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
    );
  }
};

export const getLikedSongs = async ({ userId, accessToken }) => {
  assertSupabaseConfigured();

  const url = `${supabaseConfig.url}/rest/v1/${TABLE}?user_id=eq.${userId}&order=created_at.desc`;
  const res = await axios.get(url, buildSupabaseHeaders(accessToken));

  return res.data.map((row) => ({
    trackId: row.track_id,
    trackName: row.track_name,
    artistName: row.artist_name,
    albumName: row.album_name,
    previewUrl: row.preview_url,
    artworkUrl: row.artwork_url,
  }));
};

export const likeSong = async ({ userId, accessToken, song }) => {
  assertSupabaseConfigured();

  const url = `${supabaseConfig.url}/rest/v1/${TABLE}`;
  const body = {
    user_id: userId,
    track_id: song.trackId,
    track_name: song.trackName,
    artist_name: song.artistName,
    album_name: song.albumName,
    preview_url: song.previewUrl,
    artwork_url: song.artworkUrl,
  };

  const res = await axios.post(
    url,
    body,
    buildSupabaseInsertHeaders(accessToken),
  );

  const row = res.data[0];
  return {
    trackId: row.track_id,
    trackName: row.track_name,
    artistName: row.artist_name,
    albumName: row.album_name,
    previewUrl: row.preview_url,
    artworkUrl: row.artwork_url,
  };
};

export const unlikeSong = async ({ userId, accessToken, trackId }) => {
  assertSupabaseConfigured();

  const url = `${supabaseConfig.url}/rest/v1/${TABLE}?user_id=eq.${userId}&track_id=eq.${trackId}`;
  await axios.delete(url, buildSupabaseHeaders(accessToken));
};
