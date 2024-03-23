'use server';

import 'server-only';

import Stripe from 'stripe';

import { Plan } from '@/app/pricing/server/fetch-plans';
import { createStripeCustomerPortal } from '@/app/profile/server/create-stripe-customer-portal';
import type { UserProfile } from '@/app/profile/server/fetch-user-profile';

/**
 * Creates a Stripe checkout session for the given user.
 * Documentation: https://stripe.com/docs/api/checkout/sessions/create
 */
export async function createCheckoutSession(
  user: UserProfile,
  plan: Plan,
  successUrl: string,
  cancelUrl: string,
  origin: string
) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not set');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Check if customer already has a subscription
  if (user.subscription?.customer_id) {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.subscription.customer_id,
    });
    if (subscriptions.data.length > 0) {
      // Customer already has a subscription, we should create customer portal and redirect to it
      const portalSessionUrl = await createStripeCustomerPortal(
        user.id,
        user.subscription.customer_id,
        `${origin}/profile?anchor=subscription`
      );
      return portalSessionUrl;
    }
  }

  // Check by email if customer already has a subscription
  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });
  if (customers.data.length > 0) {
    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
    });
    if (subscriptions.data.length > 0) {
      // Customer already has a subscription, we should create customer portal and redirect to it
      const portalSessionUrl = await createStripeCustomerPortal(
        user.id,
        customer.id,
        `${origin}/profile?anchor=subscription`
      );
      return portalSessionUrl;
    }
  }

  if (plan.price_id === null) throw new Error('No price id, cannot create checkout session');

  const checkoutSessionCreateParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription', // mode should be subscription
    line_items: [
      {
        price: plan.price_id, // price id
        quantity: 1,
      },
    ],
    payment_method_collection: 'always',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  };

  if (user.subscription?.customer_id) {
    checkoutSessionCreateParams.customer = user.subscription.customer_id;
  } else {
    checkoutSessionCreateParams.customer_email = user.email;
    // If customer ID not present, that means the user is new to Stripe, so we set the trial period
    checkoutSessionCreateParams.subscription_data = {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel', // If user doesn't add payment method, cancel the subscription after the trial ends
        },
      },
      trial_period_days: plan.trial_days,
    };
  }

  const session = await stripe.checkout.sessions.create(checkoutSessionCreateParams);
  if (!session.url) throw new Error('No session url');
  return session.url;
}
