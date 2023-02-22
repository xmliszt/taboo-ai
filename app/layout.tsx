'use client';

import './global.css';
import './main.css';
import { Orbitron, Grenze } from '@next/font/google';
import { AnalyticsWrapper } from './(components)/AnalayticsWrapper';
import WordCarousell from './(components)/WordCarousell';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MdDarkMode, MdOutlineWbTwilight } from 'react-icons/md';

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
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>();
  const pathName = usePathname();

  useEffect(() => {
    !isMounted && setIsMounted(true);
  }, []);

  useEffect(() => {
    isMounted && setIsDark(localStorage.getItem('theme') === 'dark');
  }, [isMounted]);

  const onToggle = () => {
    const dark = !isDark;
    setIsDark(dark);
    const theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    setIsDark(theme === 'dark');
  };

  const getLocationClass = () => {
    switch (pathName) {
      case '/':
        return 'top-5 left-5';
      case '/result':
      case '/level':
      case '/whatsnew':
      case '/buymecoffee':
        return 'top-4 lg:top-3.5 left-12 lg:left-20';
      case '/levels':
      case '/ai':
      case '/rule':
        return 'top-4 right-5 lg:top-3.5';
      default:
        return 'bottom-5 left-5';
    }
  };

  return (
    <html
      lang='en'
      className={`${isDark ? 'dark' : 'light'} ${
        isDark ? orbitron.className : grenze.className
      } font-serif`}
    >
      <head />
      <body className='bg-black dark:bg-neon-black dark:text-neon-white text-white'>
        {!(pathName?.match(/^\/level$/)?.length ?? 0 > 0) && <WordCarousell />}
        <button
          id='theme'
          aria-label='toggle light/dark button'
          data-testid='light-dark-toggle-button'
          className={`fixed z-50 ${getLocationClass()} opacity-100 hover:animate-pulse transition-all text-2xl lg:text-5xl dark:text-neon-blue
      }`}
          onClick={onToggle}
        >
          {isDark ? <MdDarkMode /> : <MdOutlineWbTwilight />}
        </button>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
