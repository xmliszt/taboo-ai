import { stripe } from '@/lib/stripe/server';

import 'server-only';

export async function retrieveCheckoutSession(checkoutSessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  return checkoutSession;
}
