import Stripe from 'stripe';

/**
 * Fetches the Stripe customer of a user using email. Returns null if not found.
 */
export async function fetchStripeCustomerForUser(userEmail: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe key not found');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const fetchCustomerResponse = await stripe.customers.list({
    email: userEmail,
    limit: 1,
  });
  if (fetchCustomerResponse.data.length === 0) return null;
  return fetchCustomerResponse.data[0];
}
