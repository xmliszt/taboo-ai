'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

import { useAuth } from '../../auth-provider';

export default function SubscriptionLockDialog() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const listener = EventManager.bindEvent(CustomEventKey.SUBSCRIPTION_LOCK_DIALOG, () => {
      setIsOpen(true);
    });
    return () => {
      EventManager.removeListener(CustomEventKey.SUBSCRIPTION_LOCK_DIALOG, listener);
    };
  }, [setIsOpen]);

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
            {(user?.subscription?.customer_plan_type ?? 'free').toUpperCase()} plan
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your current subscription plan does not have access to this content. To access, consider
            upgrade your plan.
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
