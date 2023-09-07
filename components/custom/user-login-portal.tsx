'use client';

import { useAuth } from '@/app/AuthProvider';
import { LogOut, User } from 'lucide-react';
import { Spinner } from './spinner';
import { IconButton } from '../ui/icon-button';

export function UserLoginPortal() {
  const { user, status, login, logout } = useAuth();

  return user && status === 'authenticated' ? (
    <div className='flex flex-row gap-2 items-center'>
      <div>Hello! {user.displayName}</div>
      <IconButton
        aria-label='Click to logout'
        onClick={logout}
        tooltip='Logout'
      >
        <LogOut />
      </IconButton>
    </div>
  ) : status === 'loading' ? (
    <Spinner />
  ) : (
    <div>
      <IconButton aria-label='Click to login' onClick={login} tooltip='Login'>
        <User />
      </IconButton>
    </div>
  );
}
