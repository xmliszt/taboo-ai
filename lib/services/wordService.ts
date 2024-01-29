'use server';

import { cookies } from 'next/headers';
import { toLower, trim } from 'lodash';

import { createClient } from '@/lib/utils/supabase/server';

import { IWord } from '../types/word.type';

/**
 * Adds a word to the database
 */
export const addWord = async (
  targetWord: string,
  taboos: string[],
  isVerified = false,
  userId: string | undefined = undefined
): Promise<void> => {
  const supabaseClient = createClient(cookies());
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
export const fetchWord = async (targetWord: string): Promise<IWord | undefined> => {
  const supabaseClient = createClient(cookies());
  const target = toLower(trim(targetWord));
  const fetchTabooWordsResponse = await supabaseClient
    .from('words')
    .select()
    .eq('word', target)
    .maybeSingle();
  if (fetchTabooWordsResponse.error) return undefined;
  else return fetchTabooWordsResponse.data ?? undefined;
};
