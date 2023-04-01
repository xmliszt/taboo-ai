'use client';

import { Orbitron, Grenze } from '@next/font/google';
import { AnalyticsWrapper } from './(components)/AnalayticsWrapper';
import WordCarousell from './(components)/WordCarousell';
import FeaturePopup from './(components)/(FeaturePopup)/FeaturePopup';
import Maintenance from './(components)/Maintenance';
import Header from './(components)/Header';
import { ChakraProvider } from '@chakra-ui/react';

import './global.css';
import './main.css';

const lightFont = Grenze({
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
  variable: '--font-light',
});

const darkFont = Orbitron({
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
  variable: '--font-dark',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenanceMode = JSON.parse(
    process.env.NEXT_PUBLIC_MAINTENANCE || 'false'
  );

  return (
    <html lang='en'>
      <head />
      <body
        className={`bg-black dark:bg-neon-black dark:text-neon-white text-white ${lightFont.variable} ${darkFont.variable} font-light dark:font-dark`}
      >
        <ChakraProvider>
          <Header maintenanceOn={maintenanceMode} />
          {maintenanceMode && <Maintenance />}
          {!maintenanceMode && children}
          {!maintenanceMode && <FeaturePopup />}
          <AnalyticsWrapper />
          <WordCarousell />
        </ChakraProvider>
      </body>
    </html>
  );
}
