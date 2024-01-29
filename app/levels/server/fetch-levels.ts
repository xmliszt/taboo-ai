'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { createBrowserClient } from '@supabase/ssr';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetches all levels with ranks info.
 */
export async function fetchAllLevelsAndRanks() {
  const supabaseClient = createClient(cookies());
  const fetchAllLevelsResponse = await supabaseClient
    .from('v_levels_with_created_by_and_ranks')
    .select();
  if (fetchAllLevelsResponse.error) throw fetchAllLevelsResponse.error;

  return fetchAllLevelsResponse.data.map((level) => ({
    ...level,
    is_ai_generated: false,
  }));
}

export type FetchAllLevelsAndRanksReturnTypeSingle = AsyncReturnType<
  typeof fetchAllLevelsAndRanks
>[number];

/**
 * Fetches all levels
 */
export async function fetchAllLevels() {
  const supabaseClient = createClient(cookies());
  const fetchAllLevelsResponse = await supabaseClient.from('levels').select();
  if (fetchAllLevelsResponse.error) throw fetchAllLevelsResponse.error;
  return fetchAllLevelsResponse.data;
}

/**
 * Fetches all levels without cookies, using a browser client
 */
export async function fetchAllLevelsWithoutCookies() {
  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const fetchAllLevelsResponse = await supabaseClient.from('levels').select();
  if (fetchAllLevelsResponse.error) throw fetchAllLevelsResponse.error;
  return fetchAllLevelsResponse.data;
}
