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
import {
  clearCachedGame,
  clearLevel,
  clearScores,
  clearUser,
  getFeaturePopupString,
  getUser,
} from '../lib/cache';
import { confirmAlert } from 'react-confirm-alert';
import Link from 'next/link';
import { BsFillQuestionSquareFill } from 'react-icons/bs';
import FeaturePopup from './(components)/(FeaturePopup)/FeaturePopup';

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
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    !isMounted && setIsMounted(true);
    if (isMounted) {
      const featurePopupString = getFeaturePopupString();
      if (!featurePopupString) {
        setShowFeaturePopup(true);
      } else if (featurePopupString !== CONSTANTS.featurePopupString) {
        setShowFeaturePopup(true);
      } else {
        setShowFeaturePopup(false);
      }
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
    if (!registeredEvents.includes(CONSTANTS.eventKeys.noScoreAvailable)) {
      window.addEventListener(
        CONSTANTS.eventKeys.noScoreAvailable,
        onNoScoreAvailable as EventListener
      );
      registeredEvents.push(CONSTANTS.eventKeys.noScoreAvailable);
    }
    if (!registeredEvents.includes(CONSTANTS.eventKeys.fetchLevelError)) {
      window.addEventListener(
        CONSTANTS.eventKeys.fetchLevelError,
        onErrorFetchingLevel as EventListener
      );
      registeredEvents.push(CONSTANTS.eventKeys.fetchLevelError);
    }
    if (!registeredEvents.includes(CONSTANTS.eventKeys.alreadyAttemptedLevel)) {
      window.addEventListener(
        CONSTANTS.eventKeys.alreadyAttemptedLevel,
        onAlreadyAttemptedLevel as EventListener
      );
      registeredEvents.push(CONSTANTS.eventKeys.alreadyAttemptedLevel);
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
    window.removeEventListener(
      CONSTANTS.eventKeys.noScoreAvailable,
      onNoScoreAvailable as EventListener
    );
    window.removeEventListener(
      CONSTANTS.eventKeys.fetchLevelError,
      onErrorFetchingLevel as EventListener
    );
    window.removeEventListener(
      CONSTANTS.eventKeys.alreadyAttemptedLevel,
      onAlreadyAttemptedLevel as EventListener
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

  const onNoScoreAvailable = () => {
    toast.warn(
      'Sorry! You do not have any saved game records. Try play some games before accessing the scores!',
      { autoClose: 3000 }
    );
  };

  const onErrorFetchingLevel = () => {
    toast.error('Unable to fetch daily challenge! Please try again later!');
  };

  const onAlreadyAttemptedLevel = () => {
    toast.warn("Seems like you have attempted today's challenge.");
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
        {showFeaturePopup && <FeaturePopup />}
        <section
          id='header-section'
          className={`w-full fixed top-0 h-12 lg:h-20 gap-2 z-40 p-4 grid grid-cols-[1fr_auto_1fr] text-center items-center content-start ${
            pathName === '/daily-challenge' ||
            pathName === '/level' ||
            pathName === '/ai'
              ? ''
              : 'bg-black dark:bg-neon-black'
          } `}
        >
          {pathName === '/' ? (
            <Link
              href='/rule'
              aria-label='Link to rule page'
              className='text-white dark:text-neon-red-light text-xl dark:text-sm lg:dark:text-2xl lg:text-3xl'
            >
              <div className='flex flex-row gap-2 items-center'>
                <BsFillQuestionSquareFill data-testid='rule-icon' />
                <span>Help</span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {pathName === '/' ? (
            currentUser ? (
              <div className='flex-grow text-center text-gray flex flex-row gap-2 justify-around items-center dark:text-xs lg:text-xl lg:dark:text-lg h-4'>
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
            )
          ) : (
            <div></div>
          )}
          <LightDarkToggle
            onToggle={(dark) => {
              setIsDark(dark);
            }}
          />
        </section>

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
