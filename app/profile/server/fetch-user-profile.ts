'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import { fetchStripeCustomerForUser } from '@/app/profile/server/fetch-stripe-customer';
import {
  fetchUserStripSubscription,
  fetchUserSubscriptionsFromStripe,
} from '@/app/profile/server/fetch-subscriptions-from-stripe';
import type { Database } from '@/lib/supabase/extension/types';
import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetches the user profile in auth of the currently logged-in user.
 */
export async function fetchCurrentAuthUser() {
  const supabaseClient = createClient(cookies());
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();
  if (error) throw new Error('You are not logged in');
  if (!user) throw new Error('You are not logged in');
  return user;
}

/**
 * Fetches the custom stored user profile of the currently logged-in user.
 */
export async function fetchUserProfile(): Promise<
  Database['public']['Tables']['users']['Row'] & {
    subscription:
      | (Database['public']['Tables']['subscriptions']['Row'] & {
          user_id: string | null | undefined;
          customer_id: string | null | undefined;
        })
      | null;
    user_plan: Database['public']['Tables']['plans']['Row'] | undefined;
  }
> {
  const supabaseClient = createClient(cookies());
  const currentAuthUser = await fetchCurrentAuthUser();
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select('*,subscription:subscriptions(*)')
    .eq('id', currentAuthUser.id)

    .limit(1)
    .returns<
      (Database['public']['Tables']['users']['Row'] & {
        subscription: Database['public']['Tables']['subscriptions']['Row'] | null;
      })[]
    >();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  const userProfile = fetchUserProfileResponse.data[0];
  if (!userProfile) throw new Error('User profile not found');
  const availablePlans = await fetchPlans();
  const userPlan = availablePlans.find(
    (plan) => plan.type === userProfile.subscription?.customer_plan_type
  );

  // Check to restore stripe customer if needed
  if (!userProfile.subscription?.customer_id) {
    const stripeCustomer = await fetchStripeCustomerForUser(userProfile.email);
    if (stripeCustomer) {
      // Fetch user subscription from stripe
      const userSubscription = await fetchUserSubscriptionsFromStripe(stripeCustomer.id);
      const planId = userSubscription[0].items.data[0].plan.id;
      const customerPlanType = availablePlans.find((plan) => plan.price_id === planId)?.type;
      // Update user subscription in db
      const { data: subscriptionData, error } = await supabaseClient
        .from('subscriptions')
        .update({ customer_id: stripeCustomer.id, customer_plan_type: customerPlanType ?? 'free' })
        .eq('user_id', userProfile.id)
        .select()
        .single();
      if (error) throw error;
      return {
        ...userProfile,
        subscription: subscriptionData,
        user_plan: userPlan,
      };
    } else {
      return {
        ...userProfile,
        subscription: {
          user_id: userProfile.id,
          customer_id: null,
          customer_plan_type: 'free',
        },
        user_plan: userPlan,
      };
    }
  } else {
    // With customer_id, fetch subscription from stripe
    const userSubscription = await fetchUserSubscriptionsFromStripe(
      userProfile.subscription.customer_id
    );
    const planId = userSubscription[0].items.data[0].plan.id;
    const customerPlanType = availablePlans.find((plan) => plan.price_id === planId)?.type;
    // Update user subscription in db
    const { data: subscriptionData, error } = await supabaseClient
      .from('subscriptions')
      .update({ customer_plan_type: customerPlanType ?? 'free' })
      .eq('user_id', userProfile.id)
      .select()
      .single();
    if (error) throw error;
    return {
      ...userProfile,
      subscription: subscriptionData,
      user_plan: userPlan,
    };
  }
}

/**
 * Fetches the custom stored user profile of the currently logged-in user, with Stripe subscriptions.
 */
export async function fetchUserProfileWithSubscription() {
  const user = await fetchUserProfile();
  const { stripeSubscription } = await fetchUserStripSubscription(user);
  return {
    ...user,
    stripeSubscription,
  };
}

export type UserProfile = AsyncReturnType<typeof fetchUserProfile>;
export type UserProfileWithStripeSubscription = AsyncReturnType<
  typeof fetchUserProfileWithSubscription
>;
