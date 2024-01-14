'use server';

import 'server-only';

import Stripe from 'stripe';

/**
 * Deletes a Stripe customer.
 */
export async function deleteStripeCustomer(customerId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  await stripe.customers.del(customerId);
}
