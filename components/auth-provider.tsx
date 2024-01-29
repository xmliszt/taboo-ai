'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  fetchUserWithSubscriptions,
  UserWithSubscriptions,
} from '@/app/profile/client/fetch-user-subscriptions';

interface AuthProviderProps {
  children: React.ReactNode;
}

const authProviderContext = createContext<{
  isLoading: boolean;
  user?: UserWithSubscriptions;
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
