'use client';

import { useEffect, useRef, useState } from 'react';
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

export interface SignInReminderProps {
  title: string;
  message?: string;
  redirectHref?: string;
  afterDialogClose?: () => void;
  cancelLabel?: string;
}

export default function SignInReminderDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>();
  const [redirectHref, setRedirectHref] = useState<string>();
  const [customCancelLabel, setCustomCancelLabel] = useState('Cancel');
  const afterDialogCloseRef = useRef<(() => void) | null>(null);
  const router = useRouter();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.SIGN_IN_REMINDER,
      ({
        detail: { title, message, redirectHref, afterDialogClose, cancelLabel },
      }: {
        detail: SignInReminderProps;
      }) => {
        setTitle(title);
        setMessage(message);
        setRedirectHref(redirectHref);
        afterDialogClose && (afterDialogCloseRef.current = afterDialogClose);
        cancelLabel && setCustomCancelLabel(cancelLabel);
        setIsOpen(true);
      }
    );
    return () => {
      EventManager.removeListener(CustomEventKey.SIGN_IN_REMINDER, listener);
    };
  }, []);

  const handleSignIn = () => {
    if (redirectHref) {
      router.push(`/sign-in?redirect=${redirectHref}`);
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {message && <AlertDialogDescription>{message}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              afterDialogCloseRef.current && afterDialogCloseRef.current();
            }}
          >
            {customCancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction autoFocus onClick={handleSignIn}>
            Sign in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
