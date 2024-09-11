'use server';

import { z } from 'zod';

import { stripe } from '@/lib/stripe/server';

const PRICE_METADATA_SCHEMA = z.object({
  name: z.string(),
  description: z.string(),
  tokens_granted: z.string(),
});

export async function getPrices(...priceIds: string[]) {
  const prices = await Promise.all(
    priceIds.map(async (priceId) => {
      const price = await stripe.prices.retrieve(priceId);
      const metadata = PRICE_METADATA_SCHEMA.parse(price.metadata);
      if (typeof price.unit_amount !== 'number')
        throw new Error(`Price ${price.id} does not have a valid unit_amount`);

      const unitDollar = price.unit_amount / 100;
      return {
        ...price,
        metadata,
        unitDollar,
      };
    })
  );
  return prices;
}
