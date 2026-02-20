import axios from 'axios';
import supabaseConfig from '@config/supabase';
import { badImplementation } from '@utils/responseInterceptors';

const assertSupabaseConfigured = () => {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw badImplementation(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
    );
  }
};

export const supabaseLoginWithPassword = async ({ email, password }) => {
  assertSupabaseConfigured();

  const res = await axios.post(
    `${supabaseConfig.url}/auth/v1/token?grant_type=password`,
    { email, password },
    {
      headers: {
        apikey: supabaseConfig.anonKey,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
};

export const supabaseSignupWithPassword = async ({ email, password }) => {
  assertSupabaseConfigured();

  const res = await axios.post(
    `${supabaseConfig.url}/auth/v1/signup`,
    { email, password },
    {
      headers: {
        apikey: supabaseConfig.anonKey,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
};

export const supabaseLogout = async ({ accessToken }) => {
  assertSupabaseConfigured();

  await axios.post(
    `${supabaseConfig.url}/auth/v1/logout`,
    {},
    {
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getSupabaseUserFromToken = async ({ accessToken }) => {
  assertSupabaseConfigured();

  const res = await axios.get(`${supabaseConfig.url}/auth/v1/user`, {
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

