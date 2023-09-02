'use client';

import { AuthStatus } from '@/app/AuthProvider';
import { firebaseAuth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User>();
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');

  useEffect(() => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user);
        setStatus('authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, status, setStatus };
}
