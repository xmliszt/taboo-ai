'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';

interface AuthProviderProps {
  children: React.ReactNode;
}

const authProviderContext = createContext<{
  isLoading: boolean;
  user?: User;
}>({ isLoading: false });

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['fetch-user'],
    queryFn: fetchUserProfile,
    retry: false,
  });

  return (
    <authProviderContext.Provider {...props} value={{ user, isLoading }}>
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
