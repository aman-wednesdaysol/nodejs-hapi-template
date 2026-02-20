import axios from 'axios';
import { badImplementation } from '@utils/responseInterceptors';
import { SB_HEADER } from '@utils/constants';
import supabaseConfig from '@config/supabase';



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
     SB_HEADER
  );

  return res.data;
};

export const supabaseSignupWithPassword = async ({ email, password }) => {
  assertSupabaseConfigured();

  const res = await axios.post(
    `${supabaseConfig.url}/auth/v1/signup`,
    { email, password },
SB_HEADER
  );

  return res.data;
};

export const supabaseLogout = async () => {
  assertSupabaseConfigured();

  await axios.post(
    `${supabaseConfig.url}/auth/v1/logout`,
    {},
  SB_HEADER
  );
};

export const getSupabaseUserFromToken = async () => {
  assertSupabaseConfigured();

  const res = await axios.get(`${supabaseConfig.url}/auth/v1/user`, SB_HEADER);

  return res.data;
};

