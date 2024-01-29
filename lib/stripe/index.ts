import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!stripePromise && pk) {
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
};

export default getStripe;
