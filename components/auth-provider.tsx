'use client';

import React, { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { IUserSubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { IUser } from '@/lib/types/user.type';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

const authProviderContext = createContext<{
  user?: IUser;
  userPlan?: IUserSubscriptionPlan;
  status: AuthStatus;
  setStatus?: Dispatch<SetStateAction<AuthStatus>>;
  login?: () => Promise<void>;
  logout?: () => Promise<void>;
  refreshUserSubscriptionPlan?: () => Promise<void>;
}>({
  status: 'loading',
});

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { user, userPlan, status, setStatus, login, logout, refreshUserSubscriptionPlan } =
    useSupabaseAuth();

  return (
    <authProviderContext.Provider
      {...props}
      value={{
        user,
        userPlan,
        status,
        setStatus,
        login,
        logout,
        refreshUserSubscriptionPlan,
      }}
    >
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
