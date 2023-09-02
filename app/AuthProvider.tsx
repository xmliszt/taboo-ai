'use client';

import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { User } from 'firebase/auth';
import { createContext, useContext } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

const authProviderContext = createContext<{
  user?: User;
  status: AuthStatus;
  setStatus?: (status: AuthStatus) => void;
}>({
  status: 'unauthenticated',
});

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { user, status, setStatus } = useFirebaseAuth();
  return (
    <authProviderContext.Provider value={{ user, status, setStatus }}>
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
