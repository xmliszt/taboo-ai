'use client';

import { useAuth } from '@/app/AuthProvider';
import { firebaseAuth } from '@/firebase';
import useToast from '@/lib/hooks/useToast';
import { IconButton, Spinner, Stack, Tooltip } from '@chakra-ui/react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';

export function UserLoginPortal() {
  const { toast } = useToast();
  const { user, status, setStatus } = useAuth();
  const onLogin = async () => {
    try {
      setStatus && setStatus('loading');
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      setStatus && setStatus('authenticated');
    } catch (error) {
      console.error(error.message);
      toast({ title: 'Failed to sign in!', status: 'error' });
      setStatus && setStatus('unauthenticated');
    }
  };

  const onLogout = async () => {
    setStatus && setStatus('loading');
    await signOut(firebaseAuth);
    setStatus && setStatus('unauthenticated');
  };

  return user && status === 'authenticated' ? (
    <div>
      <Stack direction='row' gap='2' alignItems='center'>
        <div>Hello! {user.displayName}</div>
        <Tooltip label='Click to logout' hasArrow>
          <IconButton size='sm' aria-label='Click to logout' onClick={onLogout}>
            <BiLogOut />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  ) : status === 'loading' ? (
    <Spinner />
  ) : (
    <div>
      <Tooltip label='Click to login' hasArrow>
        <IconButton
          size='sm'
          aria-label='Click to login'
          onClick={onLogin}
          icon={<BsPersonFill />}
        />
      </Tooltip>
    </div>
  );
}
