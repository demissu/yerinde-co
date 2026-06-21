import { createClient } from '@supabase/supabase-js';

const viteEnv = (import.meta.env ?? {}) as ImportMetaEnv;
const supabaseUrl = viteEnv.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = viteEnv.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
