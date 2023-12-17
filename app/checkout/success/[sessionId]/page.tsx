'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  checkoutSuccess,
  fetchAvailableSubscriptionPlans,
} from '@/lib/services/subscriptionService';

import { Confetti } from './confetti';

export default function CheckoutSuccessPage({
  params: { sessionId },
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const planModel = useQuery({
    queryKey: ['plan-model'],
    queryFn: async () => {
      const plans = await fetchAvailableSubscriptionPlans();
      const proPlan = plans.find((plan) => plan.type === 'pro');
      return proPlan;
    },
  });

  useEffect(() => {
    const linkCustomer = async () => {
      try {
        const response = await checkoutSuccess(sessionId);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        console.error(error);
        console.log('show alert');
        setShowAlert(true);
      }
    };
    linkCustomer();
  }, [sessionId]);

  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto py-20 leading-snug'>
        {!showAlert && (
          <>
            <h1 className='-mt-10 text-center text-4xl font-bold'>Thank you for your purchase!</h1>
            <div>
              You are now a <Badge>PRO</Badge> user 🎉
            </div>
            <Card className='min-w-4/5 mx-4 mt-2 border-2 border-primary drop-shadow-lg'>
              <CardHeader>
                <CardDescription className='text-lg italic text-muted-foreground'>
                  {planModel.isLoading || planModel.data === undefined
                    ? 'Loading your benefits... '
                    : 'You can now enjoy...'}
                </CardDescription>
                <Separator />
              </CardHeader>
              <CardContent>
                {planModel.data ? (
                  <ul>
                    {planModel.data.features.map((feature) => (
                      <li key={feature.id} className='mb-2 flex flex-row items-center gap-2'>
                        <Check size={20} color='#7eb262' strokeWidth={2} />
                        <span>{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
            <Link
              href='/profile?anchor=subscription'
              className='mt-2 rounded-xl bg-primary p-4 text-primary-foreground'
            >
              View My Subscription
            </Link>
          </>
        )}
        <AlertDialog
          open={showAlert}
          onOpenChange={(open) => {
            setShowAlert(open);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Something went wrong!</AlertDialogTitle>
              <AlertDialogDescription className='leading-snug'>
                Something unexpected happened during the update process between Stripe and us. Your
                subscription may not be updated with us. Taboo AI team has been notified and we will
                help you resolve this issue as soon as possible! Alternatively, you can also raise
                an issue report to us in the subscription section in your profile
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  router.push('/profile?anchor=subscription');
                }}
              >
                View My Subscription Status
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {!showAlert && <Confetti />}
    </>
  );
}
