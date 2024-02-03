'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function fetchAllWords() {
  const supabaseClient = createServiceRoleClient();
  const fetchAllWordsResponse = await supabaseClient.from('words').select();
  if (fetchAllWordsResponse.error) throw fetchAllWordsResponse.error;
  return fetchAllWordsResponse.data;
}
