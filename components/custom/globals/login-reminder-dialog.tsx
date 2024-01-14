'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '@/components/header/server/login';
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

export interface LoginReminderProps {
  title: string;
  message?: string;
  redirectHref?: string;
  afterDialogClose?: () => void;
  cancelLabel?: string;
}

export default function LoginReminderDialog() {
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
      await login();
      redirectHref && router.push(redirectHref);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to log in');
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
