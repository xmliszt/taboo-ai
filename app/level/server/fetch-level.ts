import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

export const fetchLevel = async (id: string) => {
  const supabaseClient = createClient(cookies());
  const fetchSingleLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('id', id)
    .single();
  if (fetchSingleLevelResponse.error) throw fetchSingleLevelResponse.error;
  return { ...fetchSingleLevelResponse.data, is_ai_generated: false };
};
