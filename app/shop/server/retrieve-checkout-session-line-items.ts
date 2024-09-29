import 'server-only';

import { stripe } from '@/lib/stripe/server';

export async function retrieveCheckoutSessionLineItems(checkoutSessionId: string) {
  const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSessionId);
  return { lineItems };
}
