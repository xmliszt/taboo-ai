import { doc, updateDoc } from 'firebase/firestore';
import {
  ISubscriptionPlan,
  IUserSubscriptionPlan,
} from '../types/subscription-plan.type';
import moment from 'moment';
import { firestore } from '@/firebase/firebase-client';
import Stripe from 'stripe';

/**
 * Creates a checkout session for the given plan
 * @param {string} priceId - The Stripe price id
 * @param {string} name - The customer name
 * @param {string} email - The customer email
 * @param {string} customerId - The customer id
 * @returns {Promise<string>} - The checkout session url
 */
export const createCheckoutSession = async (
  priceId: string,
  name?: string,
  email?: string,
  customerId?: string
): Promise<string> => {
  try {
    const response = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        priceId: priceId,
        customerName: name,
        customerEmail: email,
        customerId: customerId,
      }),
    });
    const { redirectUrl } = await response.json();
    return redirectUrl;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create checkout session');
  }
};

/**
 * Fetches the customer's subscriptions
 * @param {string} email - The customer email
 * @param {string | undefined} customerId - The customer id
 * @returns {Promise<IUserSubscriptionPlan | undefined>} - The customer's subscription plan
 */
export const fetchCustomerSubscriptions = async (
  email: string,
  customerId?: string
): Promise<IUserSubscriptionPlan | undefined> => {
  if (!customerId) return undefined;
  try {
    const response = await fetch(
      '/api/subscriptions?customerId=' + customerId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { subscriptions } = await response.json();
    if (subscriptions.length === 0) {
      // if user has no subscription in stripe, update user's plan to free in firebase
      await updateDoc(doc(firestore, 'users', email), {
        customerId: customerId,
        customerPlanType: 'free',
      });
      return undefined;
    }
    const subscription = subscriptions[0];
    const priceId = subscription.items.data[0].plan.id;
    const availablePlans = await fetchAvailableSubscriptionPlans();
    // find the plan subscribed by user based on priceId, if not found, default get the free plan object
    const planSubscribed =
      availablePlans.find((plan) => plan.priceId === priceId) ??
      availablePlans.find((plan) => plan.type === 'free');
    // The user subscription plan model that will be available in the app.
    const userSubscriptionPlan: IUserSubscriptionPlan = {
      type: planSubscribed?.type,
      tier: planSubscribed?.tier,
      priceId: priceId,
      subId: subscription.id,
      status: subscription.status,
      trialEndDate: subscription.trial_end
        ? moment.unix(subscription.trial_end)
        : undefined,
      nextBillingDate: moment.unix(subscription.current_period_end),
      currentBillingStartDate: moment.unix(subscription.current_period_start),
      subscription: subscription,
    };
    return userSubscriptionPlan;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * Fetches the subscription plans
 * @returns {Promise<ISubscriptionPlan[]>} - The subscription plans
 */
export const fetchAvailableSubscriptionPlans = async (): Promise<
  ISubscriptionPlan[]
> => {
  const response = await fetch('/api/subscriptions/plans');
  const plans = await response.json();
  return plans as ISubscriptionPlan[];
};

/**
 * Call this function when user has successfully completed checkout session
 * from Stripe. This will update the user's document in Firestore with
 * the customerId and subscription plan type
 * @param {string} sessionId - The checkout session id
 */
export const checkoutSuccess = async (sessionId: string) => {
  await fetch('/api/checkout/success?session=' + sessionId);
};

/**
 * Call this function when user has cancelled checkout session.
 * @param {string} subId - The id of the subscription to cancel
 */
export const cancelSubscription = async (
  subId: string
): Promise<Stripe.Subscription> => {
  const response = await fetch('/api/subscriptions/cancel?subId=' + subId);
  const json = await response.json();
  return json.subscription;
};
