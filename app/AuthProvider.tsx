'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import * as React from 'react';

export function AuthProvider({ children, ...props }: SessionProviderProps) {
  return <SessionProvider {...props}>{children}</SessionProvider>;
}
