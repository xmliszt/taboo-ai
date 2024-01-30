'use server';

import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

/**
 * Increment the view count of the app.
 */
export async function incrementView() {
  // Use service role client to bypass RLS
  const supabaseClient = createServiceRoleClient();
  await supabaseClient.rpc('f_increment_with_text_as_id', {
    _row_id: 'app_views',
    _x: 1,
    _table_name: 'app_stats',
    _field_name: 'value',
  });
}
