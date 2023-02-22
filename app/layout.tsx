'use client';

import './global.css';
import './main.css';
import { Orbitron, Grenze } from '@next/font/google';
import { AnalyticsWrapper } from './(components)/AnalayticsWrapper';
import WordCarousell from './(components)/WordCarousell';
import { usePathname } from 'next/navigation';
import LightDarkSwitchButton, {
  Theme,
} from './(components)/LightDarkSwitchButton';
import { useState } from 'react';

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
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const pathName = usePathname();

  const onThemeChange = (theme: Theme) => {
    setIsDark(theme === Theme.Dark);
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
        <LightDarkSwitchButton onThemeChanged={onThemeChange} />
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
