'use client';

import { AuthStatus } from '@/app/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { firebaseAuth } from '@/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { signInWithGoogle } from '../services/authService';

export function useFirebaseAuth() {
  const { toast } = useToast();
  const [user, setUser] = useState<User>();
  const [status, setStatus] = useState<AuthStatus>('loading');

  const login = useCallback(async () => {
    try {
      setStatus('loading');
      await signInWithGoogle();
      toast({ title: 'Signed in!' });
      setStatus('authenticated');
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        toast({
          title: 'Sign in popup blocked by browser.',
          variant: 'destructive',
        });
        setStatus('unauthenticated');
        return;
      } else if (error.code === 'auth/cancelled-popup-request') {
        setStatus('loading');
        return;
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({ title: 'Sign in is cancelled.' });
        setStatus('unauthenticated');
        return;
      }
      console.error(error);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus('loading');
    await signOut(firebaseAuth);
    await firebaseAuth.signOut();
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setStatus('authenticated');
    } else {
      setUser(undefined);
      setStatus('unauthenticated');
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user);
        setStatus('authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, status, login, logout };
}
