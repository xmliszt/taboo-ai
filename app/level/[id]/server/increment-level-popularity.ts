import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

export const incrementLevelPopularity = async (id: string) => {
  // Use service role client to bypass RLS
  const supabaseClient = createServiceRoleClient();
  const incrementLevelPopularityResponse = await supabaseClient.rpc('increment', {
    _table_name: 'levels',
    _row_id: id,
    _field_name: 'popularity',
    _x: 1,
  });
  if (incrementLevelPopularityResponse.error) throw incrementLevelPopularityResponse.error;
};
