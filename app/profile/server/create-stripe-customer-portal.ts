'use server';

import Stripe from 'stripe';

import { track } from '@/lib/logsnag/logsnag-server';

/**
 * Creates a Stripe customer portal session.
 */
export async function createStripeCustomerPortal(
  userId: string,
  customerId: string,
  redirectUrl: string
) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl,
  });
  await track({
    channel: 'subscription',
    event: 'manage_billing',
    icon: '💳',
    notify: false,
    tags: {
      user_id: userId,
      customer_id: customerId,
      portal_session_id: portalSession.id,
    },
  });
  return portalSession.url;
}
