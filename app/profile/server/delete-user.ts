'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { cancelStripeSubscription } from '@/app/profile/server/cancel-stripe-subscription';
import { deleteStripeCustomer } from '@/app/profile/server/delete-stripe-customer';
import { fetchUserProfileWithSubscription } from '@/app/profile/server/fetch-user-profile';
import { createClient } from '@/lib/utils/supabase/server';

export async function deleteUser(userId: string) {
  // First, we need to delete the user's subscriptions & stripe customer
  const user = await fetchUserProfileWithSubscription();
  const subscriptionId = user.stripeSubscription?.id;
  const customerId = user.stripeSubscription?.customer as string;
  subscriptionId && (await cancelStripeSubscription(subscriptionId));
  customerId && (await deleteStripeCustomer(customerId));

  // Then we can delete the user
  const supabaseClient = createClient(cookies());
  const deleteUserResponse = await supabaseClient.from('users').delete().eq('id', userId);
  if (deleteUserResponse.error) throw deleteUserResponse.error;
}
