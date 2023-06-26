/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Grenze } from 'next/font/google';
import { AnalyticsWrapper } from '../components/AnalayticsWrapper';
import FeaturePopup from '../components/FeaturePopup/FeaturePopup';
import { ThemeProvider } from './ThemeProvider';
import Header from '../components/Header';
import Maintenance from '../components/Maintenance';
import { Metadata } from 'next';
import { _meta } from '../lib/metadata';
import PWAInstaller from './PWAInstaller';

import './global.css';
import './main.css';
import Script from 'next/script';

const font = Grenze({
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

export const metadata: Metadata = _meta;

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
      <Script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6537113723731394'
        crossOrigin='anonymous'
        strategy='beforeInteractive'
      />
      <Script id='pwa-script' src='/js/pwa.js' />
      <head />
      <body className={`${font.className} bg-black text-white`}>
        <ThemeProvider>
          <Header maintenanceOn={maintenanceMode} />
          {maintenanceMode && <Maintenance />}
          <PWAInstaller>{!maintenanceMode && children}</PWAInstaller>
          {!maintenanceMode && <FeaturePopup />}
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
