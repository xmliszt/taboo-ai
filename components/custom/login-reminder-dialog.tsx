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
import { useAuth } from '../auth-provider';

export default function LoginReminderDialog() {
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>();
  const [redirectHref, setRedirectHref] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.LOGIN_REMINDER,
      ({
        detail: { title, message, redirectHref },
      }: {
        detail: { title: string; message?: string; redirectHref?: string };
      }) => {
        setTitle(title);
        setMessage(message);
        setRedirectHref(redirectHref);
        setIsOpen(true);
      }
    );
    return () => {
      console.log('removed reminder listener');
      EventManager.removeListener(CustomEventKey.LOGIN_REMINDER, listener);
    };
  }, []);

  const handleLogin = async () => {
    try {
      login && (await login());
      redirectHref && router.push(redirectHref);
    } catch (error) {
      EventManager.fireEvent(CustomEventKey.LOGIN_ERROR, error.message);
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
          {message && (
            <AlertDialogDescription>{message}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction autoFocus onClick={handleLogin}>
            Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
