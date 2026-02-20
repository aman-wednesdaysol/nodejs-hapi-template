import supabaseConfig from '@config/supabase';

export const buildSupabaseHeaders = (accessToken) => ({
  headers: {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});

export const buildSupabaseInsertHeaders = (accessToken) => ({
  headers: {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
});
