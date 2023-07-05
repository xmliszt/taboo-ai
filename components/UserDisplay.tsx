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
} from '../lib/cache';
import { usePathname } from 'next/navigation';
import 'react-confirm-alert/src/react-confirm-alert.css';
import useToast from '../lib/hook/useToast';
import { useRouter } from 'next/navigation';
import IUser from '../types/user.interface';
import { useEffect, useState } from 'react';
import {
  addDeviceToUser,
  getUserInfo,
  updateUserLastLoginTime,
} from '../lib/services/frontend/userService';
import { Spinner } from '@chakra-ui/react';
import copy from 'clipboard-copy';
import LogRocket from 'logrocket';
import moment from 'moment';

const UserDisplay = () => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const _user = getUser();
    if (_user) {
      checkUserExists(_user.nickname).then(async (exists) => {
        exists && setUser(_user);
        !exists && clearUser();
        if (exists) {
          LogRocket.identify(_user.recovery_key, {
            name: _user.nickname,
            recoveryKey: _user.recovery_key,
            createdAt: moment(_user.created_at).format(
              'MMMM Do YYYY, h:mm:ss a'
            ),
            lastLoginAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
          });
          try {
            await updateUserLastLoginTime(
              _user.nickname,
              _user.recovery_key,
              moment().valueOf()
            );
            await addDeviceToUser(
              _user.nickname,
              _user.recovery_key,
              navigator.userAgent
            );
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  }, [pathName]);

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
            setUser(undefined);
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

  const copyRecoveryKeyToClipboard = async () => {
    if (user) {
      await copy(user.recovery_key);
      toast({
        title: 'Recovery Key is copied to clipboard!',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Sorry, something went wrong!',
        status: 'error',
        duration: 1000,
      });
    }
  };

  if (pathName === '/') {
    if (isLoading) {
      return <Spinner />;
    }
    return user ? (
      <div className='text-center text-gray flex flex-row gap-2 justify-around items-center dark:text-xs lg:text-xl lg:dark:text-lg h-4'>
        <span
          className='underline cursor-pointer'
          onClick={copyRecoveryKeyToClipboard}
        >
          {user.nickname}
        </span>
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
