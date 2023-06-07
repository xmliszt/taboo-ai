'use client';

import Link from 'next/link';
import { confirmAlert } from 'react-confirm-alert';
import {
  clearCachedGame,
  clearLevel,
  clearScores,
  clearUser,
  getUser,
  setTipsAck,
} from '../../lib/cache';
import { usePathname } from 'next/navigation';
import 'react-confirm-alert/src/react-confirm-alert.css';
import useToast from '../../lib/hook/useToast';
import { useRouter } from 'next/navigation';
import IUser from '../../types/user.interface';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../lib/services/frontend/userService';
import { Spinner } from '@chakra-ui/react';

const UserDisplay = () => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const _user = getUser();
    if (_user) {
      checkUserExists(_user.nickname).then((exists) => {
        exists && setUser(_user);
        !exists && clearUser();
      });
    }
  }, []);

  const checkUserExists = async (nickname: string) => {
    try {
      setIsLoading(true);
      await getUserInfo(nickname);
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title:
          'Sorry, this nickname no longer exists. Please create a new nickname!',
        status: 'error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const quit = () => {
    confirmAlert({
      title: 'Are you sure?',
      message:
        'Quitting will remove all your saved games locally. You will need to recover or submit new nickname in order to participate in the leaderboard rankings again.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            clearCachedGame();
            clearScores();
            clearLevel();
            clearUser();
            setTipsAck(false);
            toast({
              title: 'You have been logged out!',
              status: 'warning',
              duration: 1500,
            });
            setTimeout(() => {
              router.refresh();
            }, 1000);
          },
        },
        { label: 'No' },
      ],
    });
  };

  if (pathName === '/') {
    if (isLoading) {
      return <Spinner />;
    }
    return user ? (
      <div className='text-center text-gray flex flex-row gap-2 justify-around items-center dark:text-xs lg:text-xl lg:dark:text-lg h-4'>
        <span>{user.nickname}</span>
        <button
          id='submit'
          data-style='none'
          className='underline text-base dark:text-xs lg:text-xl lg:dark:text-lg text-red-light dark:text-neon-red-light'
          aria-label='Click to quit and logout from current account'
          onClick={quit}
        >
          Quit
        </button>
      </div>
    ) : (
      <div className='text-center text-gray dark:text-sm'>
        <Link href='/recovery' className='underline'>
          Recover Your Scores?
        </Link>
      </div>
    );
  } else {
    return <></>;
  }
};

export default UserDisplay;
