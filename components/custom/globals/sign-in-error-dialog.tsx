'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signIn } from '@/components/header/server/sign-in';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

export interface SignInErrorEventProps {
  error: string;
  redirectHref?: string;
}

export function SignInErrorDialog() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [redirectHref, setRedirectHref] = useState<string>();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.SIGN_IN_ERROR,
      ({ detail: { error, redirectHref } }: { detail: SignInErrorEventProps }) => {
        console.log(error);
        setAlertHeader(error);
        setAlertOpen(true);
        setRedirectHref(redirectHref);
      }
    );
    return () => {
      EventManager.removeListener(CustomEventKey.SIGN_IN_ERROR, listener);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn();
      redirectHref && router.push(redirectHref);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to sign in');
    }
  };

  return (
    <AlertDialog
      open={alertOpen}
      onOpenChange={(open) => {
        setAlertOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertHeader}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            onClick={() => {
              setAlertOpen(false);
              void handleSignIn();
            }}
          >
            Try Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
