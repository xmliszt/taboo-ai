import { SubscriptionPlanType } from './subscription-plan.type';

export default interface IUser {
  uid?: string;
  email: string;
  name?: string; // Name from google auth
  nickname?: string; // Player custom name
  photoUrl?: string;
  firstLoginAt?: string;
  lastLoginAt?: string;
  gameAttemptedCount?: number;
  gamePlayedCount?: number;
  levelPlayedCount?: number;
  anonymity?: boolean; // Whether to show user's nickname in leaderboard
  customerId?: string; // Stripe subscription customer ID, if null, means user is not subscribed yet.
  customerPlanType?: SubscriptionPlanType; // The current plan type user is subscribed to, this is a Taboo AI defined ID, not the Stripe price ID
}
