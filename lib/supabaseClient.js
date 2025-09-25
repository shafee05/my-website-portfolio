
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing:', {
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? '[REDACTED]' : 'undefined',
  });
  throw new Error('Supabase URL or Anon Key is not defined');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);