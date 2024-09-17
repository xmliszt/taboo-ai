import 'server-only';

import { createServiceRoleClient } from '@/lib/utils/supabase/service-role';

type SaveCheckoutHistoryOptions = {
  userId: string;
  checkoutSessionId: string;
  priceId: string;
  price: number;
  tokens: number;
};

export async function saveCheckoutHistory(options: SaveCheckoutHistoryOptions) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('users_checkout_history')
    .insert({
      user_id: options.userId,
      checkout_session_id: options.checkoutSessionId,
      price_id: options.priceId,
      price: options.price,
      tokens: options.tokens,
    })
    .select()
    .single();
  if (error) throw error.message;

  return { checkoutHistory: data };
}
