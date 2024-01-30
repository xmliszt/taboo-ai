'use server';

import { toLower, trim } from 'lodash';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

/**
 * Adds a word to the database
 */
export const addWord = async (
  targetWord: string,
  taboos: string[],
  isVerified = false,
  userId: string | undefined = undefined
): Promise<void> => {
  // Use service role client to bypass RLS
  const supabaseClient = createServiceRoleClient();
  const target = toLower(trim(targetWord));
  const insertNewTabooWordsResponse = await supabaseClient.from('words').upsert(
    {
      word: target,
      taboos: taboos.map(trim).map(toLower),
      is_verified: isVerified,
      created_by: userId,
    },
    { onConflict: 'word', ignoreDuplicates: false }
  );
  if (insertNewTabooWordsResponse.error) throw insertNewTabooWordsResponse.error;
};

/**
 * Fetches a word from the database
 */
export const fetchWord = async (targetWord: string) => {
  const supabaseClient = createServiceRoleClient();
  const target = toLower(trim(targetWord));
  const fetchTabooWordsResponse = await supabaseClient
    .from('words')
    .select()
    .eq('word', target)
    .maybeSingle();
  if (fetchTabooWordsResponse.error) return undefined;
  else return fetchTabooWordsResponse.data ?? undefined;
};
