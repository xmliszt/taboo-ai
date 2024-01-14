'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import { fetchUserStripSubscription } from '@/app/profile/server/fetch-subscriptions-from-stripe';
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
export async function fetchUserProfile() {
  const supabaseClient = createClient(cookies());
  const currentAuthUser = await fetchCurrentAuthUser();
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select('*,subscription:subscriptions!inner(*)')
    .eq('id', currentAuthUser.id)
    .single();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  const availablePlans = await fetchPlans();
  const userPlan = availablePlans.find(
    (plan) => plan.type === fetchUserProfileResponse.data.subscription?.customer_plan_type
  );
  return {
    ...fetchUserProfileResponse.data,
    user_plan: userPlan,
  };
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
