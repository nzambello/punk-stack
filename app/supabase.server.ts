import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_API_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SECRET_SERVICE_ROLE
} from './variables.server';

const supabaseOptions = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
};

const supabase = createClient(
  SUPABASE_API_URL,
  SUPABASE_ANON_KEY,
  supabaseOptions
);

export const supabaseAdmin = createClient(
  SUPABASE_API_URL,
  SUPABASE_SECRET_SERVICE_ROLE,
  supabaseOptions
);

export default supabase;
