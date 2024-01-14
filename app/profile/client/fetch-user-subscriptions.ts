import { createClient } from '@/lib/utils/supabase/client';

/**
 * Fetches the custom stored user profile of the currently logged-in user.
 */
export async function fetchUserWithSubscriptions() {
  const supabaseClient = createClient();
  const authUserResponse = await supabaseClient.auth.getUser();
  if (authUserResponse.error) throw authUserResponse.error;
  const { user: authUser } = authUserResponse.data;
  const fetchUserProfileResponse = await supabaseClient
    .from('users')
    .select('*,subscription:subscriptions!inner(*)')
    .eq('id', authUser.id)
    .single();
  if (fetchUserProfileResponse.error) throw fetchUserProfileResponse.error;
  // Fetch plan
  const fetchAvailablePlans = await supabaseClient.from('plans').select('*,plan_features(*)');
  if (fetchAvailablePlans.error) throw fetchAvailablePlans.error;
  const subscribedPlan = fetchAvailablePlans.data.find(
    (plan) => plan.type === fetchUserProfileResponse.data.subscription?.customer_plan_type
  );
  // Fetch subscriptions
  const customerId = fetchUserProfileResponse.data.subscription?.customer_id;
  const customerEmail = fetchUserProfileResponse.data.email;
  if (customerId) {
    const fetchSubscriptionResponse = await fetch(`/api/subscriptions?customer_id=${customerId}`);
    const fetchSubscriptionJson = await fetchSubscriptionResponse.json();
    if (fetchSubscriptionJson.error) throw fetchSubscriptionJson.error;
    return {
      ...fetchUserProfileResponse.data,
      user_plan: subscribedPlan,
      stripeSubscription: fetchSubscriptionJson.subscription,
    };
  }
  const fetchSubscriptionResponse = await fetch(
    `/api/subscriptions?customer_email=${customerEmail}`
  );
  const fetchSubscriptionJson = await fetchSubscriptionResponse.json();
  if (fetchSubscriptionJson.error) throw fetchSubscriptionJson.error;
  return {
    ...fetchUserProfileResponse.data,
    user_plan: subscribedPlan,
    stripeSubscription: fetchSubscriptionJson.subscription,
  };
}
