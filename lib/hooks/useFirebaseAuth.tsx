'use client';

import { AuthStatus } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { firebaseAuth } from '@/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { signInWithGoogle } from '../services/authService';

const TIMEOUT = 60000; // seconds

export function useFirebaseAuth() {
  const { toast } = useToast();
  const [user, setUser] = useState<User>();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const loginTimer = useRef<NodeJS.Timeout | null>(null);

  const login = useCallback(async () => {
    try {
      setStatus('loading');
      loginTimer.current = setTimeout(() => {
        if (status === 'loading') {
          setStatus('unauthenticated');
          toast({
            title: 'Sign in timeout. Please try again!',
            variant: 'destructive',
          });
        }
      }, TIMEOUT);
      await signInWithGoogle();
      toast({ title: 'Signed in!' });
      setStatus('authenticated');
    } catch (error) {
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        toast({
          title: 'Sign in popup blocked by browser.',
          variant: 'destructive',
        });
        setStatus('unauthenticated');
        return;
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({ title: 'Sign in is cancelled.' });
        setStatus('unauthenticated');
        return;
      }
      console.error(error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
    } finally {
      loginTimer.current && clearTimeout(loginTimer.current);
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading');
    await signOut(firebaseAuth);
    await firebaseAuth.signOut();
    setStatus('unauthenticated');
  }, []);

  const onFirstLoadSetupAuth = useCallback(async () => {
    await firebaseAuth.authStateReady();
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setStatus('authenticated');
    } else {
      setUser(undefined);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    onFirstLoadSetupAuth();
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user);
        setStatus('authenticated');
      }
    });

    return () => unsubscribe();
  }, [onFirstLoadSetupAuth]);

  return { user, status, login, logout };
}
