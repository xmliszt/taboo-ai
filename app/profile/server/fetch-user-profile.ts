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
    error,
  } = await supabaseClient.auth.getUser();
  if (error) throw new Error('You are not logged in');
  if (!user) throw new Error('You are not logged in');
  return user;
}

/**
 * Fetches the custom stored user profile of the currently logged-in user.
 */
export async function fetchUserProfile() {
  const supabaseClient = createClient(cookies());
  const currentAuthUser = await fetchCurrentAuthUser();
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select()
    .eq('id', currentAuthUser.id)

    .limit(1)
    .single();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  return fetchUserProfileResponse.data;
}
