import { createClient } from '@supabase/supabase-js';

console.log(process.env);
export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.ANON_KEY ?? ''
);
