import _ from 'lodash';

import { createClient } from '@/lib/utils/supabase/client';

import { IWord } from '../types/word.type';

export const addTabooWords = async (
  targetWord: string,
  taboos: string[],
  isVerified = false,
  userId: string | undefined = undefined
): Promise<void> => {
  const supabaseClient = createClient();
  const target = _.toLower(_.trim(targetWord));
  const insertNewTabooWordsResponse = await supabaseClient.from('words').upsert(
    {
      word: target,
      taboos: taboos.map(_.trim).map(_.toLower),
      is_verified: isVerified,
      created_by: userId,
    },
    { onConflict: 'word', ignoreDuplicates: false }
  );
  if (insertNewTabooWordsResponse.error) throw insertNewTabooWordsResponse.error;
};

export const fetchTabooWords = async (targetWord: string): Promise<IWord | undefined> => {
  const supabaseClient = createClient();
  const target = _.toLower(_.trim(targetWord));
  const fetchTabooWordsResponse = await supabaseClient
    .from('words')
    .select()
    .eq('word', target)
    .maybeSingle();
  if (fetchTabooWordsResponse.error) return undefined;
  else return fetchTabooWordsResponse.data ?? undefined;
};
