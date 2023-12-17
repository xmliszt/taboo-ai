'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { checkoutSuccess } from '@/lib/services/subscriptionService';

import { Confetti } from './confetti';

export default function CheckoutSuccessPage({
  params: { sessionId },
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

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
      <div className='mt-20 flex w-full flex-col items-center justify-center'>
        {!showAlert && (
          <>
            <h1 className='-mt-10 text-center text-4xl font-bold leading-snug'>
              Thank you for your purchase!
            </h1>
            <Link
              href='/profile?anchor=subscription'
              className='mt-10 rounded-xl bg-primary p-6 text-primary-foreground'
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
