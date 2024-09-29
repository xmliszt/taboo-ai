'use server';

import { stripe } from '@/lib/stripe/server';

export async function createPaymentLink({
  priceId,
  redirectUrl,
}: {
  priceId: string;
  redirectUrl: string;
}) {
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    automatic_tax: {
      enabled: true,
    },
    after_completion: {
      type: 'redirect',
      redirect: { url: `${redirectUrl}/{CHECKOUT_SESSION_ID}` },
    },
  });
  return paymentLink;
}
