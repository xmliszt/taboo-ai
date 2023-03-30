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
import LoadingMask from './(components)/LoadingMask';

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
  const [isLoading, setIsLoading] = useState(false);
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
      fetchMaintenance();
      fetchCurrentUser();
    }
  }, [isMounted]);

  const fetchMaintenance = async () => {
    setIsLoading(true);
    try {
      const data = await getMaintenance();
      setMaintenanceData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = () => {
    const user = getUser();
    console.log(user);
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

  return (
    <html
      lang='en'
      className={`${isDark && 'dark'} ${
        isDark ? orbitron.className : grenze.className
      } font-serif`}
    >
      <head />
      <body className='bg-black dark:bg-neon-black dark:text-neon-white text-white'>
        <LoadingMask isLoading={isLoading} message='Fetching data for you...' />
        {/* {!(pathName === '/level' || pathName === '/daily-challenge') && (
          <WordCarousell />
        )} */}
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
          children
        )}
        <AnalyticsWrapper />
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
      </body>
    </html>
  );
}
