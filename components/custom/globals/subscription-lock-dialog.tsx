'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth-provider';

export default function SubscriptionLockDialog() {
  const { userPlan } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.SUBSCRIPTION_LOCK_DIALOG,
      () => {
        setIsOpen(true);
      }
    );
    return () => {
      EventManager.removeListener(
        CustomEventKey.SUBSCRIPTION_LOCK_DIALOG,
        listener
      );
    };
  }, []);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Oops, you are currently on{' '}
            {(userPlan?.type ?? 'free').toUpperCase()} plan
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your current subscription plan does not have access to this content.
            To access, consider upgrade your plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            onClick={() => {
              router.push('/pricing');
            }}
          >
            Upgrade My Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
