'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetches all levels with ranks info.
 */
export const fetchAllLevelsAndRanks = async () => {
  const supabaseClient = createClient(cookies());
  const fetchAllLevelsResponse = await supabaseClient
    .from('v_levels_with_created_by_and_ranks')
    .select();
  if (fetchAllLevelsResponse.error) throw fetchAllLevelsResponse.error;

  return fetchAllLevelsResponse.data.map((level) => ({
    ...level,
    is_ai_generated: false,
  }));
};

export type FetchAllLevelsAndRanksReturnTypeSingle = AsyncReturnType<
  typeof fetchAllLevelsAndRanks
>[number];

/**
 * Fetches all levels
 * FIXME: cookies() not available when called in generateStaticParams()
 */
export const fetchAllLevels = async () => {
  const supabaseClient = createClient(cookies());
  const fetchAllLevelsResponse = await supabaseClient.from('levels').select();
  if (fetchAllLevelsResponse.error) throw fetchAllLevelsResponse.error;
  return fetchAllLevelsResponse.data;
};
