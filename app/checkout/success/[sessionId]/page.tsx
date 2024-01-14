import Link from 'next/link';
import { Check } from 'lucide-react';

import { updateUserProfileWithCheckoutSession } from '@/app/checkout/success/[sessionId]/server/update-user-profile-with-checkout-session';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Confetti } from './confetti';

export default async function CheckoutSuccessPage({
  params: { sessionId },
}: {
  params: { sessionId: string };
}) {
  const { plan } = await updateUserProfileWithCheckoutSession(sessionId);

  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto py-20 leading-snug'>
        <h1 className='-mt-10 text-center text-4xl font-bold'>Thank you for your purchase!</h1>
        <div>
          You are now a <Badge>PRO</Badge> user 🎉
        </div>
        <Card className='min-w-4/5 mx-4 mt-2 border-2 border-primary drop-shadow-lg'>
          <CardHeader>
            <CardDescription className='text-lg italic text-muted-foreground'>
              You can now enjoy...
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <ul>
              {plan.plan_features.map((feature) => (
                <li key={feature.id} className='mb-2 flex flex-row items-center gap-2'>
                  <Check size={20} color='#7eb262' strokeWidth={2} />
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Link
          href='/profile?anchor=subscription'
          className='mt-2 rounded-xl bg-primary p-4 text-primary-foreground'
        >
          View My Subscription
        </Link>
      </div>
      <Confetti />
    </>
  );
}
