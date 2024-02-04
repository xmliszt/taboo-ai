'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function fetchWords(words: string[]) {
  const supabaseClient = createServiceRoleClient();
  const fetchWordsResponse = await supabaseClient.from('words').select().in('word', words);
  if (fetchWordsResponse.error) throw fetchWordsResponse.error;
  return fetchWordsResponse.data;
}
