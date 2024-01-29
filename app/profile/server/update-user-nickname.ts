'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

export async function updateUserNickname(newNickname: string) {
  const supabaseClient = createClient(cookies());
  const authUserResponse = await supabaseClient.auth.getUser();
  if (authUserResponse.error) throw authUserResponse.error;
  const userId = authUserResponse.data?.user?.id;
  if (!userId) throw new Error('You are not logged in');
  const updateUserNicknameResponse = await supabaseClient
    .from('users')
    .update({
      nickname: newNickname,
    })
    .eq('id', userId);
  if (updateUserNicknameResponse.error) throw updateUserNicknameResponse.error;
}
