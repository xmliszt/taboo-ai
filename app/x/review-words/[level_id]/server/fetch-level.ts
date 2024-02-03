'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function fetchLevel(levelId: string) {
  const supabaseClient = createServiceRoleClient();
  const fetchLevelResponse = await supabaseClient
    .from('levels')
    .select('*,author:users(*)')
    .eq('id', levelId)
    .maybeSingle();
  if (fetchLevelResponse.error) throw new Error(fetchLevelResponse.error.message);
  if (!fetchLevelResponse.data) throw new Error('Level not found');
  return fetchLevelResponse.data;
}
