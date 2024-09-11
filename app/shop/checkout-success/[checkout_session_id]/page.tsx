import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Gem } from 'lucide-react';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { Confetti } from '@/components/custom/confetti';
import { Button } from '@/components/ui/button';

import { getPrices } from '../../server/get-prices';
import { retrieveCheckoutSession } from '../../server/retrieve-checkout-session';
import { retrieveCheckoutSessionLineItems } from '../../server/retrieve-checkout-session-line-items';
import { updateUserTokens } from '../../server/update-user-tokens';

type CheckoutSuccessPageProps = {
  params: {
    checkout_session_id: string;
  };
};

export default async function CheckoutSuccessPage({ params }: CheckoutSuccessPageProps) {
  const user = await fetchUserProfile();
  if (!user) redirect('/sign-in');

  const checkoutSession = await retrieveCheckoutSession(params.checkout_session_id);
  if (!checkoutSession) throw new Error('Checkout session not found');

  if (checkoutSession.status !== 'complete') throw new Error('Checkout session not completed');
  if (checkoutSession.payment_status !== 'paid') throw new Error('Checkout session not paid');

  const { lineItems } = await retrieveCheckoutSessionLineItems(params.checkout_session_id);

  const priceId = lineItems.data.at(0)?.price?.id;
  if (!priceId) throw new Error('Price ID not found in checkout session');

  const prices = await getPrices(priceId);
  const price = prices.at(0);
  if (!price) throw new Error('Price not found');

  const tokens = parseInt(price.metadata.tokens_granted);
  if (isNaN(tokens)) throw new Error('Invalid tokens granted');

  const { user: updatedUser } = await updateUserTokens({ tokens });

  // TODO(@xmliszt): Make this checkout session no longer valid

  return (
    <main className='flex h-screen w-full items-start justify-center pt-24'>
      <div className='flex flex-col items-center justify-center gap-y-6'>
        <h2 className='text-2xl font-bold'>You&apos;re all set!</h2>
        <div className='flex flex-col items-center justify-center gap-y-2 rounded-lg border p-6'>
          <p>You now have</p>
          <div className='flex items-center gap-x-2'>
            <span className='text-4xl font-bold'>{updatedUser.tokens}</span>
            <Gem className='size-8' />
          </div>
        </div>

        <Link href='/levels'>
          <Button>Continue playing</Button>
        </Link>
      </div>
      <Confetti />
    </main>
  );
}
