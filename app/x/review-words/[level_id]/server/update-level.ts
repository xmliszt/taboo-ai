'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function updateLevel(levelId: string, fields: { [key: string]: any }) {
  const supabaseClient = createServiceRoleClient();
  const updateLevelResponse = await supabaseClient.from('levels').update(fields).eq('id', levelId);
  if (updateLevelResponse.error) throw updateLevelResponse.error;
}
