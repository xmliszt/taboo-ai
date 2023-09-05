/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Grenze } from 'next/font/google';
import { AnalyticsWrapper } from '../components/AnalayticsWrapper';
import FeaturePopup from '../components/feature-popup/feature-popup';
import Maintenance from '../components/Maintenance';
import { Metadata } from 'next';
import { _meta } from '../lib/metadata';
import PWAInstaller from './PWAInstaller';
import Script from 'next/script';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { GlobalTooltipProvider } from '@/components/TooltipProvider';
import Header from '@/components/Header';

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
      <Script id='pwa-script' src='/js/pwa.js' />
      <Script id='clarity-script' src='/js/clarity.js' />
      <head />
      <body className={`${font.className} scrollbar-hide`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <GlobalTooltipProvider delayDuration={300}>
            <AuthProvider>
              <Header maintenanceOn={maintenanceMode} />
              {maintenanceMode && <Maintenance />}
              <PWAInstaller>{!maintenanceMode && children}</PWAInstaller>
              {!maintenanceMode && <FeaturePopup />}
              <AnalyticsWrapper />
            </AuthProvider>
          </GlobalTooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
