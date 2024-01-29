'use server';

import 'server-only';

import { cookies } from 'next/headers';
import Stripe from 'stripe';

import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import { createClient } from '@/lib/utils/supabase/server';

/**
 * Updates the user subscription in db with the Stripe checkout session.
 */
export async function updateUserProfileWithCheckoutSession(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe secret key not set');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const customer = (await stripe.customers.retrieve(session.customer as string, {
    expand: ['subscriptions'],
  })) as Stripe.Customer;
  if (!customer) throw new Error('Customer not found');

  const email = customer.email;
  if (!email) throw new Error('Customer email not found');

  const plans = await fetchPlans();
  const planID = customer.subscriptions?.data[0].items.data[0].plan.id;
  const subscribedPlan = plans.find((plan) => plan.price_id === planID);
  if (!subscribedPlan) throw new Error('Subscribed plan not found');

  const supabaseClient = createClient(cookies());
  // fetch user with email
  const fetchUserResponse = await supabaseClient.from('users').select().eq('email', email).single();
  if (fetchUserResponse.error) throw fetchUserResponse.error;

  const { error } = await supabaseClient.from('subscriptions').upsert(
    {
      user_id: fetchUserResponse.data.id,
      customer_id: customer.id,
      customer_plan_type: subscribedPlan.type,
    },
    {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    }
  );
  if (error) throw error;
  return { plan: subscribedPlan };
}
