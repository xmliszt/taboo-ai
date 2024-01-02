import moment from 'moment';
import Stripe from 'stripe';

export type SubscriptionPlanType = 'free' | 'pro';

export interface ISubscriptionPlanFeature {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'partial' | 'absent';
}

export interface ISubscriptionPlan {
  type: SubscriptionPlanType;
  priceId: string | undefined; // from Stripe. free plan does not have priceId
  name: string;
  pricePerMonth: number;
  trialsDays: number;
  tier: number; // The tier of the plan, 1 is the lowest, 2 is the second lowest, etc. This is for determining downgrade or upgrade
  features: ISubscriptionPlanFeature[];
}

/**
 * The representation of the user's subscription plan, for display in profile
 */
export interface IUserSubscriptionPlan {
  customerId?: string; // customer ID from Stripe. free plan does not have customerId
  type?: SubscriptionPlanType; // if undefined, user is default under free plan
  tier?: number; // The tier of the plan, 1 is the lowest, 2 is the second lowest, etc. This is for determining downgrade or upgrade
  status?: Stripe.Subscription.Status; // free plan does not have status
  priceId?: string; // price ID from Stripe. free plan does not have priceId
  subId?: string; // subscription ID from Stripe. free plan does not have subId
  trialEndDate?: moment.Moment;
  nextBillingDate?: moment.Moment;
  currentBillingStartDate?: moment.Moment;
  subscription?: Stripe.Subscription;
}
