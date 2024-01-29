'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Update the anonymity of a user
 */
export async function updateUserAnonymity(userId: string, isAnonymous: boolean) {
  const supabaseClient = createClient(cookies());
  const updateResponse = await supabaseClient
    .from('users')
    .update({ is_anonymous: isAnonymous })
    .eq('id', userId);
  if (updateResponse.error) throw updateResponse.error;
}
