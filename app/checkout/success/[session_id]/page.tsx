import Link from 'next/link';
import { Check } from 'lucide-react';

import { updateUserProfileWithCheckoutSession } from '@/app/checkout/success/[session_id]/server/update-user-profile-with-checkout-session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Confetti } from './confetti';

type CheckoutSuccessPageProps = {
  params: {
    session_id: string;
  };
};

export default async function CheckoutSuccessPage(props: CheckoutSuccessPageProps) {
  const { plan } = await updateUserProfileWithCheckoutSession(props.params.session_id);

  return (
    <>
      <div className='mx-auto flex h-full max-w-lg flex-col gap-6 px-4 py-10 leading-snug sm:gap-10'>
        <div className='flex flex-col justify-center gap-2 text-center'>
          <h1 className='text-center text-3xl font-bold'>Thank you for your purchase!</h1>
          <div>
            You are now a <Badge>Pro</Badge> user 🎉
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='w-full pt-2 text-left text-base italic text-muted-foreground'>
            You can now enjoy...
          </div>
          <div className='rounded-lg border-2 border-primary p-4 drop-shadow-lg'>
            <ul>
              {plan.plan_features.map((feature) => (
                <li key={feature.id} className='mb-2 flex flex-row items-center gap-2'>
                  <Check size={20} color='#7eb262' strokeWidth={2} />
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='flex justify-center'>
          <Link
            href='/ai'
            className='group relative transition-transform ease-out hover:scale-105 '
          >
            <Button
              variant={'default'}
              className='p-4 transition-[padding_font-size_font-weight] ease-in-out group-hover:p-6 group-hover:text-lg'
            >
              Play AI generated topics
            </Button>
            <span className='unicorn-color absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card opacity-50 transition-[transform_opacity_blur] ease-in-out after:blur-xl group-hover:opacity-100' />
          </Link>
        </div>
      </div>
      <Confetti />
    </>
  );
}
