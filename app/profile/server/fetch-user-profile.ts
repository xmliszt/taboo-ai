'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetches the user profile in auth of the currently logged-in user.
 */
export async function fetchCurrentAuthUser() {
  const supabaseClient = createClient(cookies());
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  return user;
}

/**
 * Fetches the custom stored user profile of the currently logged-in user.
 */
export async function fetchUserProfile() {
  const supabaseClient = createClient(cookies());
  const currentAuthUser = await fetchCurrentAuthUser();
  if (!currentAuthUser) return undefined;
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select()
    .eq('id', currentAuthUser.id)
    .maybeSingle();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  return fetchUserProfileResponse.data ?? undefined;
}
