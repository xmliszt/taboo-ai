import { createClient } from '@/lib/utils/supabase/client';

export async function logout() {
  const supabaseClient = createClient();
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}
