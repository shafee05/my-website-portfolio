// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  if (typeof window === 'undefined') return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};