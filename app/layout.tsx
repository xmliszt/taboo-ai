'use client';

import './global.css';
import './main.css';
import { Orbitron, Grenze } from '@next/font/google';
import { AnalyticsWrapper } from './(components)/AnalayticsWrapper';
import WordCarousell from './(components)/WordCarousell';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LightDarkToggle from './(components)/LightDarkToggle';
import { getMaintenance } from '../lib/services/frontend/maintenanceService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { CONSTANTS } from '../lib/constants';
import IUser from '../types/user.interface';
import { clearUser, getUser } from '../lib/cache';
import { confirmAlert } from 'react-confirm-alert';
import Link from 'next/link';

const grenze = Grenze({
  weight: '400',
  subsets: ['latin'],
  fallback: [
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
});

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
  fallback: [
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
});

interface IMaintenance {
  isGPTOutage: boolean;
}

let registeredEvents: string[] = [];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [maintenanceData, setMaintenanceData] = useState<IMaintenance>();
  const [currentUser, setCurrentUser] = useState<IUser | undefined>();
  const [isDark, setIsDark] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    !isMounted && setIsMounted(true);
    if (isMounted) {
      registerEventListeners();
      fetchMaintenance();
      fetchCurrentUser();
    }

    return () => {
      removeEventListeners();
    };
  }, [isMounted]);

  const fetchMaintenance = async () => {
    const data = await getMaintenance();
    setMaintenanceData(data);
  };

  const fetchCurrentUser = () => {
    const user = getUser();
    user && setCurrentUser(user);
  };

  const quit = () => {
    confirmAlert({
      title: 'Sure to log out?',
      message:
        'By logging out, you will no longer be able to participate in the global leaderboard and submit your scores from the daily challenge.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            clearUser();
            setCurrentUser(undefined);
            toast.warn('You have been logged out!');
          },
        },
        { label: 'No' },
      ],
    });
  };

  const registerEventListeners = () => {
    console.log('Register event listeners...');
    if (!registeredEvents.includes(CONSTANTS.eventKeys.signUpSuccess)) {
      window.addEventListener(
        CONSTANTS.eventKeys.signUpSuccess,
        onBackFromSignUpSuccess as EventListener
      );
      registeredEvents.push(CONSTANTS.eventKeys.signUpSuccess);
    }
    if (!registeredEvents.includes(CONSTANTS.eventKeys.recoverySuccess)) {
      window.addEventListener(
        CONSTANTS.eventKeys.recoverySuccess,
        onBackFromRecoverySuccess as EventListener
      );
      registeredEvents.push(CONSTANTS.eventKeys.recoverySuccess);
    }
  };

  const removeEventListeners = () => {
    console.log('Remove event listeners...');
    window.removeEventListener(
      CONSTANTS.eventKeys.signUpSuccess,
      onBackFromSignUpSuccess as EventListener
    );
    window.removeEventListener(
      CONSTANTS.eventKeys.recoverySuccess,
      onBackFromRecoverySuccess as EventListener
    );
    registeredEvents = [];
  };

  const onBackFromSignUpSuccess = () => {
    fetchCurrentUser();
    toast.success('Nickname submitted successfully!', { autoClose: 3000 });
  };

  const onBackFromRecoverySuccess = () => {
    fetchCurrentUser();
    toast.success('Account recovered successfully!', { autoClose: 3000 });
  };

  return (
    <html
      lang='en'
      className={`${isDark && 'dark'} ${
        isDark ? orbitron.className : grenze.className
      } font-serif`}
    >
      <head />
      <body className='bg-black dark:bg-neon-black dark:text-neon-white text-white'>
        {!(pathName === '/level' || pathName === '/daily-challenge') && (
          <WordCarousell />
        )}
        <LightDarkToggle
          onToggle={(dark) => {
            setIsDark(dark);
          }}
        />
        {pathName === '/' &&
          (currentUser ? (
            <div className='fixed top-12 w-full text-center gradient-down dark:gradient-down-dark-black z-10 text-gray flex flex-row gap-2 justify-center items-center'>
              <span>Welcome Back! {currentUser.nickname}</span>
              <button
                id='submit'
                className='underline text-red-light dark:text-neon-red-light'
                aria-label='Click to quit and logout from current account'
                onClick={quit}
              >
                Quit
              </button>
            </div>
          ) : (
            <div className='fixed top-12 w-full text-center gradient-down dark:gradient-down-dark-black z-10 text-gray flex flex-row gap-2 justify-center items-center'>
              <Link href='/recovery' className='underline'>
                Recover Your Scores?
              </Link>
            </div>
          ))}

        {maintenanceData?.isGPTOutage ? (
          <section className='flex justify-center items-center text-3xl leading-normal h-full w-full p-16'>
            OpenAI API is experiencing unexpected outage. We will be back once
            the outage from OpenAI has been resolved! Thank you for your
            patience!
          </section>
        ) : (
          <>
            <ToastContainer
              position='top-center'
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              draggable
              theme='light'
            />
            {children}
          </>
        )}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
