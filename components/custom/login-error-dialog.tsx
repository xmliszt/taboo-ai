'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

import { useAuth } from '../auth-provider';

export interface LoginErrorEventProps {
  error: string;
  redirectHref?: string;
}

export function LoginErrorDialog() {
  const router = useRouter();
  const { setStatus, login } = useAuth();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [redirectHref, setRedirectHref] = useState<string>();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.LOGIN_ERROR,
      ({ detail: { error, redirectHref } }: { detail: LoginErrorEventProps }) => {
        console.log(error);
        setAlertHeader(error);
        setAlertOpen(true);
        setRedirectHref(redirectHref);
      }
    );
    return () => {
      EventManager.removeListener(CustomEventKey.LOGIN_ERROR, listener);
    };
  }, []);

  const handleLogin = async () => {
    try {
      login && (await login());
      redirectHref && router.push(redirectHref);
    } catch (error) {
      console.error(error);
      setStatus && setStatus('unauthenticated');
    }
  };

  const handleCancel = () => {
    setStatus && setStatus('unauthenticated');
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
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            onClick={() => {
              setAlertOpen(false);
              handleLogin();
            }}
          >
            Try Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
