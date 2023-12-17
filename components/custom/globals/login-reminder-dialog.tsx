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

import { useAuth } from '../../auth-provider';
import { LoginErrorEventProps } from './login-error-dialog';

export interface LoginReminderProps {
  title: string;
  message?: string;
  redirectHref?: string;
  afterDialogClose?: () => void;
  cancelLabel?: string;
}

export default function LoginReminderDialog() {
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>();
  const [redirectHref, setRedirectHref] = useState<string>();
  const [customCancelLabel, setCustomCancelLabel] = useState('Cancel');
  const afterDialogCloseRef = useRef<(() => void) | null>(null);
  const router = useRouter();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.LOGIN_REMINDER,
      ({
        detail: { title, message, redirectHref, afterDialogClose, cancelLabel },
      }: {
        detail: LoginReminderProps;
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
      EventManager.removeListener(CustomEventKey.LOGIN_REMINDER, listener);
    };
  }, []);

  const handleLogin = async () => {
    try {
      login && (await login());
      redirectHref && router.push(redirectHref);
    } catch (error) {
      EventManager.fireEvent<LoginErrorEventProps>(CustomEventKey.LOGIN_ERROR, {
        error: error.message,
        redirectHref,
      });
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
          <AlertDialogAction autoFocus onClick={handleLogin}>
            Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
