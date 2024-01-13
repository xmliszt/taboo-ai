import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

export const incrementLevelPopularity = async (id: string) => {
  const supabaseClient = createClient(cookies());
  const incrementLevelPopularityResponse = await supabaseClient.rpc('increment', {
    _table_name: 'levels',
    _row_id: id,
    _field_name: 'popularity',
    _x: 1,
  });
  if (incrementLevelPopularityResponse.error) throw incrementLevelPopularityResponse.error;
};
