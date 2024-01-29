import { createClient } from '@/lib/utils/supabase/client';

export const deleteUserFromSupabase = async (uid: string) => {
  const supabaseClient = createClient();
  const deleteUserResponse = await supabaseClient.from('users').delete().eq('id', uid);
  if (deleteUserResponse.error) {
    throw deleteUserResponse.error;
  }
};
