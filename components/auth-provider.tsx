'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUserWithSubscriptions } from '@/app/profile/client/fetch-user-subscriptions';
import type { UserProfileWithStripeSubscription } from '@/app/profile/server/fetch-user-profile';

interface AuthProviderProps {
  children: React.ReactNode;
}

const authProviderContext = createContext<{
  isLoading: boolean;
  user?: UserProfileWithStripeSubscription;
}>({ isLoading: false });

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['fetch-user'],
    queryFn: fetchUserWithSubscriptions,
    retry: false,
  });

  return (
    <authProviderContext.Provider {...props} value={{ user, isLoading }}>
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
