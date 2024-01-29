'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { cancelStripeSubscription } from '@/app/profile/server/cancel-stripe-subscription';
import { fetchUserProfileWithSubscription } from '@/app/profile/server/fetch-user-profile';
import { createClient } from '@/lib/utils/supabase/server';

export async function deleteUser() {
  // First, we need to delete the user's subscriptions
  const user = await fetchUserProfileWithSubscription();
  const subscriptionId = user.stripeSubscription?.id;
  subscriptionId && (await cancelStripeSubscription(subscriptionId));
  // Note: we don't need to delete the Stripe customer because we need
  // to check if the customer comes back, then we can restore their customer
  // information, and disallow the trial again.

  // Then we can delete the user from auth
  const supabaseClient = createClient(cookies());
  const deleteUserResponse = await supabaseClient.rpc('f_delete_auth_user');
  if (deleteUserResponse.error) throw deleteUserResponse.error;
}
