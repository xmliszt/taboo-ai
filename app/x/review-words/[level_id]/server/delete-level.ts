'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export async function deleteLevel(levelId: string) {
  const supabaseClient = createServiceRoleClient();
  const deleteLevelResponse = await supabaseClient.from('levels').delete().eq('id', levelId);
  if (deleteLevelResponse.error) throw deleteLevelResponse.error;
}
