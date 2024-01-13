'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetch all words from the database.
 */
export async function fetchAllWords() {
  const supabaseClient = createClient(cookies());
  const fetchAllWordsResponse = await supabaseClient.from('words').select();
  if (fetchAllWordsResponse.error) throw fetchAllWordsResponse.error;
  return fetchAllWordsResponse.data;
}
