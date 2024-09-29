import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

type FetchCheckoutHistoryOptions = {
  checkoutSessionId: string;
};

export async function fetchCheckoutHistory({ checkoutSessionId }: FetchCheckoutHistoryOptions) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('users_checkout_history')
    .select()
    .eq('checkout_session_id', checkoutSessionId)
    .maybeSingle();
  if (error) throw error.message;

  return { checkoutHistory: data };
}
