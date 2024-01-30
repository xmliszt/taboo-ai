'use server';

import 'server-only';

import { AsyncReturnType } from 'type-fest';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function fetchAllLevelsAndAuthors() {
  const supabaseClient = createServiceRoleClient();
  const fetchAllLevelsAndAuthorsResponse = await supabaseClient
    .from('levels')
    .select('*,author:users(*)');
  if (fetchAllLevelsAndAuthorsResponse.error) throw fetchAllLevelsAndAuthorsResponse.error;
  return fetchAllLevelsAndAuthorsResponse.data;
}

export type FetchAllLevelsAndAuthorsReturnTypeSingle = AsyncReturnType<
  typeof fetchAllLevelsAndAuthors
>[number];
