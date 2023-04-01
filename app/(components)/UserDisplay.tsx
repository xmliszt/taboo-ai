'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import IUser from '../../types/user.interface';
import {
  clearCachedGame,
  clearLevel,
  clearScores,
  clearUser,
  getUser,
} from '../../lib/cache';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import 'react-confirm-alert/src/react-confirm-alert.css';

const UserDisplay = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>();
  const pathName = usePathname();

  useEffect(() => {
    !isMounted && setIsMounted(true);
    isMounted && fetchCurrentUser();
  }, [isMounted]);

  const fetchCurrentUser = () => {
    const user = getUser();
    user && setCurrentUser(user);
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
            setCurrentUser(undefined);
            clearCachedGame();
            clearScores();
            clearLevel();
            clearUser();
            toast.warn('You have been logged out!');
          },
        },
        { label: 'No' },
      ],
    });
  };

  if (pathName === '/') {
    return currentUser ? (
      <div className='text-center text-gray flex flex-row gap-2 justify-around items-center dark:text-xs lg:text-xl lg:dark:text-lg h-4'>
        <span>{currentUser.nickname}</span>
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
      <div className='flex-grow text-center text-gray dark:text-sm'>
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
