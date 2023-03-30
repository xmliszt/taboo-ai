'use client';

import Link from 'next/link';
import { Orbitron, Grenze } from '@next/font/google';
import { AnalyticsWrapper } from './(components)/AnalayticsWrapper';
import WordCarousell from './(components)/WordCarousell';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LightDarkToggle from './(components)/LightDarkToggle';
import { ToastContainer } from 'react-toastify';
import { BsFillQuestionSquareFill } from 'react-icons/bs';
import FeaturePopup from './(components)/(FeaturePopup)/FeaturePopup';
import UserDisplay from './(components)/UserDisplay';

import './global.css';
import './main.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Maintenance from './(components)/Maintenance';
import BackButton from './(components)/BackButton';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const pathName = usePathname();
  const maintenanceMode = JSON.parse(
    process.env.NEXT_PUBLIC_MAINTENANCE || 'false'
  );

  return maintenanceMode ? (
    <html
      lang='en'
      className={`${isDark && 'dark'} ${
        isDark ? orbitron.className : grenze.className
      } font-serif`}
    >
      <head />
      <body className='bg-black dark:bg-neon-black dark:text-neon-white text-white'>
        <header
          id='header-section'
          className={
            'w-full fixed top-0 h-12 lg:h-20 gap-2 z-40 p-4 text-center bg-black dark:bg-neon-black'
          }
        >
          <LightDarkToggle
            onToggle={(dark) => {
              setIsDark(dark);
            }}
          />
        </header>
        <Maintenance />
        <WordCarousell />
        <AnalyticsWrapper />
      </body>
    </html>
  ) : (
    <html
      lang='en'
      className={`${isDark && 'dark'} ${
        isDark ? orbitron.className : grenze.className
      } font-serif`}
    >
      <head />
      <body className='bg-black dark:bg-neon-black dark:text-neon-white text-white'>
        <header
          id='header-section'
          className={`w-full fixed top-0 h-12 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center ${
            pathName === '/daily-challenge' ||
            pathName === '/level' ||
            pathName === '/ai'
              ? ''
              : 'bg-black dark:bg-neon-black'
          } `}
        >
          {pathName === '/' ? (
            <Link
              hidden={pathName !== '/'}
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
            <BackButton />
          )}
          <UserDisplay />
          <LightDarkToggle
            onToggle={(dark) => {
              setIsDark(dark);
            }}
          />
        </header>
        {children}
        <WordCarousell />
        <FeaturePopup />
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
