import { doc, updateDoc } from 'firebase/firestore';
import {
  ISubscriptionPlan,
  IUserSubscriptionPlan,
} from '../types/subscription-plan.type';
import moment from 'moment';
import { firestore } from '@/firebase/firebase-client';

/**
 * Creates a checkout session for the given plan
 * @param {string} priceId - The Stripe price id
 * @param {string} email - The customer email
 * @param {string} customerId - The customer id
 * @returns {Promise<string>} - The checkout session url
 */
export const createCheckoutSession = async (
  priceId: string,
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
 * @returns {Promise<IUserSubscriptionPlan>} - The customer's subscription plan
 */
export const fetchCustomerSubscriptions = async (
  email: string,
  customerId?: string
): Promise<IUserSubscriptionPlan | undefined> => {
  if (!customerId) return undefined;
  const response = await fetch('/api/subscriptions?customerId=' + customerId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { subscriptions } = await response.json();
  if (subscriptions.length === 0) {
    // update user's plan to free in firebase
    await updateDoc(doc(firestore, 'users', email), {
      customerId: customerId,
      customerPlanType: 'free',
    });
    return undefined;
  }
  const subscription = subscriptions[0];
  const priceId = subscription.items.data[0].plan.id;
  const availablePlans = await fetchAvailableSubscriptionPlans();
  const planSubscribed =
    availablePlans.find((plan) => plan.priceId === priceId) ??
    availablePlans.find((plan) => plan.type === 'free');
  const userSubscriptionPlan: IUserSubscriptionPlan = {
    type: planSubscribed?.type,
    tier: planSubscribed?.tier,
    priceId: priceId,
    status: subscription.status,
    trialEndDate: subscription.trial_end
      ? moment.unix(subscription.trial_end)
      : undefined,
    nextBillingDate: moment.unix(subscription.current_period_end),
    currentBillingStartDate: moment.unix(subscription.current_period_start),
  };
  return userSubscriptionPlan;
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
