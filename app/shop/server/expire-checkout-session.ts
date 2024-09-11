import 'server-only';

import { stripe } from '@/lib/stripe/server';

export async function expireCheckoutSession(checkoutSessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.expire(checkoutSessionId);
  return checkoutSession;
}
