import Stripe from 'stripe';
import { AsyncReturnType } from 'type-fest';

import { fetchUserProfileWithSubscription } from '@/app/profile/server/fetch-user-profile';
import type { Database } from '@/lib/supabase/extension/types';
import { createClient } from '@/lib/utils/supabase/client';

export type UserWithSubscriptions = AsyncReturnType<typeof fetchUserProfileWithSubscription>;

/**
 * Fetches the custom stored user profile of the currently logged-in user.
 */
export async function fetchUserWithSubscriptions(): Promise<
  Database['public']['Tables']['users']['Row'] & {
    subscription:
      | (Database['public']['Tables']['subscriptions']['Row'] & {
          user_id: string | null | undefined;
          customer_id: string | null | undefined;
        })
      | null;
    user_plan: Database['public']['Tables']['plans']['Row'] | undefined;
    stripeSubscription: Stripe.Subscription | null;
  }
> {
  const supabaseClient = createClient();
  const authUserResponse = await supabaseClient.auth.getUser();
  if (authUserResponse.error) throw authUserResponse.error;
  const { user: authUser } = authUserResponse.data;
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select('*,subscription:subscriptions(*)')
    .eq('id', authUser.id)
    .single();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  const userProfile = fetchUserProfileResponse.data;
  // Fetch plan
  const fetchAvailablePlans = await supabaseClient.from('plans').select('*,plan_features(*)');
  if (fetchAvailablePlans.error) throw fetchAvailablePlans.error;
  const subscribedPlan = fetchAvailablePlans.data.find(
    (plan) => plan.type === userProfile.subscription?.customer_plan_type
  );
  // Fetch subscriptions with customer id
  const customerId = userProfile.subscription?.customer_id;
  const customerEmail = userProfile.email;
  if (customerId) {
    const fetchSubscriptionResponse = await fetch(`/api/subscriptions?customer_id=${customerId}`);
    const fetchSubscriptionJson = await fetchSubscriptionResponse.json();
    if (fetchSubscriptionJson.error) throw fetchSubscriptionJson.error;
    const subscription = fetchSubscriptionJson.subscription as Stripe.Subscription;
    const planId = subscription.items.data[0].plan.id;
    const customerPlanType = fetchAvailablePlans.data.find((plan) => plan.price_id === planId)
      ?.type;
    return {
      ...userProfile,
      subscription: {
        user_id: userProfile.id,
        customer_id: customerId,
        customer_plan_type: customerPlanType ?? 'free',
      },
      user_plan: subscribedPlan,
      stripeSubscription: subscription,
    };
  }
  // Fetch subscription from stripe using email is customer id is not available
  const fetchSubscriptionResponse = await fetch(
    `/api/subscriptions?customer_email=${customerEmail}`
  );
  const fetchSubscriptionJson = await fetchSubscriptionResponse.json();
  if (fetchSubscriptionJson.error) throw fetchSubscriptionJson.error;
  const subscription: Stripe.Subscription | null =
    fetchSubscriptionJson.subscription as Stripe.Subscription;
  if (subscription === null || subscription === undefined) {
    return {
      ...userProfile,
      subscription: {
        user_id: userProfile.id,
        customer_id: null,
        customer_plan_type: 'free',
      },
      user_plan: subscribedPlan,
      stripeSubscription: subscription,
    };
  }
  const planId = subscription.items.data[0].plan.id;
  const customerPlanType = fetchAvailablePlans.data.find((plan) => plan.price_id === planId)?.type;

  return {
    ...userProfile,
    subscription: {
      user_id: userProfile.id,
      customer_id: subscription.customer as string,
      customer_plan_type: customerPlanType ?? 'free',
    },
    user_plan: subscribedPlan,
    stripeSubscription: subscription,
  };
}
