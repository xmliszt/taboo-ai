'use client';

import { createContext, useContext } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  user?: User;
}

const authProviderContext = createContext<{
  user?: User;
}>({});

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  return (
    <authProviderContext.Provider {...props} value={{ user: props.user }}>
      {children}
    </authProviderContext.Provider>
  );
}

export const useAuth = () => useContext(authProviderContext);
