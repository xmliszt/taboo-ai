'use server';

import 'server-only';

import Stripe from 'stripe';

/**
 * Creates a Stripe customer portal session.
 */
export async function createStripeCustomerPortal(customerId: string, redirectUrl: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl,
  });
  return portalSession.url;
}
