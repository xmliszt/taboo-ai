import { createClient } from '@supabase/supabase-js';

console.log(process.env);
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_ANON_KEY ?? ''
);
