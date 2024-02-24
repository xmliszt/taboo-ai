'use server';

import logSnag from '@/lib/logsnap-server';

import 'server-only';

import Stripe from 'stripe';

/**
 * Cancels a Stripe subscription.
 */
export async function cancelStripeSubscription(userId: string, subscriptionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  await logSnag.track({
    channel: 'subscription',
    event: 'cancel',
    user_id: userId,
    icon: '🔽',
    notify: true,
    tags: {
      subscription_id: subscriptionId,
    },
  });
}
