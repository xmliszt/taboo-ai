'use client';

import { useAuth } from '@/app/AuthProvider';
import { firebaseAuth } from '@/firebase';
import { signInWithGoogle } from '@/lib/services/authService';
import { signOut } from 'firebase/auth';
import { LogOut, User } from 'lucide-react';
import { Spinner } from './spinner';
import { Button } from '../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';

export function UserLoginPortal() {
  const { toast } = useToast();
  const { user, status, setStatus } = useAuth();
  const onLogin = async () => {
    try {
      setStatus('loading');
      await signInWithGoogle();
      toast({ title: 'Signed in!' });
      setStatus('authenticated');
    } catch (error) {
      console.error(error.message);
      toast({ title: 'Failed to sign in!', variant: 'destructive' });
      setStatus('unauthenticated');
    }
  };

  const onLogout = async () => {
    setStatus('loading');
    await signOut(firebaseAuth);
    await firebaseAuth.signOut();
    setStatus('unauthenticated');
  };

  return user && status === 'authenticated' ? (
    <div className='flex flex-row gap-2 items-center'>
      <div>Hello! {user.displayName}</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button aria-label='Click to logout' onClick={onLogout}>
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Click to logout</TooltipContent>
      </Tooltip>
    </div>
  ) : status === 'loading' ? (
    <Spinner />
  ) : (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <Button aria-label='Click to login' onClick={onLogin}>
            <User />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Click to login</TooltipContent>
      </Tooltip>
    </div>
  );
}
