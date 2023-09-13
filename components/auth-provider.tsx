'use client';

import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import IUser from '@/lib/types/user.interface';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

const authProviderContext = createContext<{
  user?: IUser;
  status: AuthStatus;
  setStatus?: Dispatch<SetStateAction<AuthStatus>>;
  login?: () => Promise<void>;
  logout?: () => Promise<void>;
}>({
  status: 'loading',
});

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { user, status, setStatus, login, logout } = useFirebaseAuth();
  return (
    <authProviderContext.Provider
      {...props}
      value={{ user, status, setStatus, login, logout }}
    >
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
