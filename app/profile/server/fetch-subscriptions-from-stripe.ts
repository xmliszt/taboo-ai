import 'server-only';

import Stripe from 'stripe';

import { UserProfile } from '@/app/profile/server/fetch-user-profile';

export async function fetchUserStripSubscription(user: UserProfile) {
  // If there is customer_id, fetch from Stripe
  if (user.subscription?.customer_id) {
    const subscriptions = await fetchUserSubscriptionsFromStripe(user.subscription.customer_id);
    if (subscriptions.length === 0) return { stripeSubscription: null };
    return {
      stripeSubscription: subscriptions[0],
    };
  } else {
    // If there is no customer_id, try to use email to fetch from Stripe
    const subscriptions = await fetchUserSubscriptionsFromStripeWithEmail(user.email);
    if (subscriptions.length === 0) return { stripeSubscription: null };
    return {
      stripeSubscription: subscriptions[0],
    };
  }
}

/**
 * Fetches the subscriptions of a user from Stripe using customerId.
 */
export async function fetchUserSubscriptionsFromStripe(customerId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });
  return subscriptions.data;
}

/**
 * Fetches the subscriptions of a user from Stripe using email.
 */
export async function fetchUserSubscriptionsFromStripeWithEmail(userEmail: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const customer = await stripe.customers.list({
    email: userEmail,
    limit: 1,
  });
  if (customer.data.length === 0) return [];
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.data[0].id,
  });
  return subscriptions.data;
}
