import { doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import Stripe from 'stripe';

import { firestore } from '@/firebase/firebase-client';

import { ISubscriptionPlan, IUserSubscriptionPlan } from '../types/subscription-plan.type';

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
  const json = await response.json();
  if (json.code === 'existing-subscription') {
    throw new Error('Sorry, you have already subscribed to a plan.');
  }
  return json.redirectUrl;
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
  // If customerId is not provided, we use user's email instead to try
  if (!customerId) {
    try {
      const response = await fetch('/api/subscriptions/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const { subscriptions } = await response.json();
      if (!Array.isArray(subscriptions)) {
        return undefined;
      }
      if (subscriptions.length === 0) {
        // if user has no subscription in stripe, update user's plan to free in firebase
        await updateDoc(doc(firestore, 'users', email), {
          customerPlanType: 'free',
        });
        return undefined;
      }
      // If we get subscription from user using email,
      // We can get the customer id from the subscription object
      // and update our db with the customer id
      const subscription: Stripe.Subscription = subscriptions[0];
      const customerID = subscription.customer;
      await updateDoc(doc(firestore, 'users', email), {
        customerId: customerID,
      });
      return buildUserSubscriptionPlanFromStripeSubscription(email, subscriptions);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  // Otherwise, we use customerId to fetch subscription (recommended way)
  try {
    const response = await fetch('/api/subscriptions?customerId=' + customerId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { subscriptions } = await response.json();
    if (!Array.isArray(subscriptions)) {
      return undefined;
    }
    if (subscriptions.length === 0) {
      // if user has no subscription in stripe, update user's plan to free in firebase
      await updateDoc(doc(firestore, 'users', email), {
        customerId: customerId,
        customerPlanType: 'free',
      });
      return undefined;
    }
    return buildUserSubscriptionPlanFromStripeSubscription(email, subscriptions);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * Fetches the subscription plans
 * @returns {Promise<ISubscriptionPlan[]>} - The subscription plans
 */
export const fetchAvailableSubscriptionPlans = async (): Promise<ISubscriptionPlan[]> => {
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
export const cancelSubscription = async (subId: string): Promise<Stripe.Subscription> => {
  const response = await fetch('/api/subscriptions/cancel?subId=' + subId);
  const json = await response.json();
  return json.subscription;
};

const buildUserSubscriptionPlanFromStripeSubscription = async (
  email: string,
  subscriptions: Stripe.Subscription[]
): Promise<IUserSubscriptionPlan | undefined> => {
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
    trialEndDate: subscription.trial_end ? moment.unix(subscription.trial_end) : undefined,
    nextBillingDate: moment.unix(subscription.current_period_end),
    currentBillingStartDate: moment.unix(subscription.current_period_start),
    subscription: subscription,
  };
  return userSubscriptionPlan;
};

/**
 * Creates a Stripe Billing Portal session for the customer,
 * and then redirects the customer to the portal.
 * @param {string} customerId - The customer id
 * @param {string} redirectUrl - The redirect url
 * @returns {Promise<string>} - The portal session url
 */
export const createCustomerPortalSession = async (
  customerId: string,
  redirectUrl: string
): Promise<string> => {
  const response = await fetch('/api/customer-portal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: customerId,
      redirectUrl: redirectUrl,
    }),
  });
  const json = await response.json();
  return json.portalSessionUrl;
};
