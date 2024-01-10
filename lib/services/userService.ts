import { createClient } from '@/lib/utils/supabase/client';

export const updateUserAnonymity = async (uid: string, anonymity: boolean) => {
  const supabaseClient = createClient();
  const updateUserAnonymityResponse = await supabaseClient
    .from('users')
    .update({
      is_anonymous: anonymity,
    })
    .eq('id', uid);
  if (updateUserAnonymityResponse.error) {
    throw updateUserAnonymityResponse.error;
  }
};

export const updateUserNickname = async (uid: string, nickname: string) => {
  const supabaseClient = createClient();
  const { error } = await supabaseClient.from('users').update({ nickname }).eq('id', uid);
  if (error) throw error;
};

export const deleteUserFromSupabase = async (uid: string) => {
  const supabaseClient = createClient();
  const deleteUserResponse = await supabaseClient.from('users').delete().eq('id', uid);
  if (deleteUserResponse.error) {
    throw deleteUserResponse.error;
  }
};
