'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/server';

export async function fetchAllLevelsAndAuthors() {
  const supabaseClient = createClient(cookies());
  const fetchAllLevelsAndAuthorsResponse = await supabaseClient
    .from('levels')
    .select('*,author:users!levels_created_by_fkey(*)');
  if (fetchAllLevelsAndAuthorsResponse.error) throw fetchAllLevelsAndAuthorsResponse.error;
  return fetchAllLevelsAndAuthorsResponse.data;
}

export type FetchAllLevelsAndAuthorsReturnTypeSingle = AsyncReturnType<
  typeof fetchAllLevelsAndAuthors
>[number];
