'use client';

import { IconButton, Spinner, Stack, Tooltip } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';

export function UserLoginPortal() {
  const { data: session, status } = useSession();

  const onLogin = () => {
    signIn();
  };

  const onLogout = () => {
    signOut();
  };

  return session && status === 'authenticated' ? (
    <div>
      <Stack direction='row' gap='2' alignItems='center'>
        <div>Hello! {session.user?.name}</div>
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
