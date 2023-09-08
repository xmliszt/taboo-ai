/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Lora } from 'next/font/google';
import { AnalyticsWrapper } from '../components/AnalayticsWrapper';
import FeaturePopup from '../components/custom/feature-popup';
import Maintenance from '../components/Maintenance';
import { Metadata } from 'next';
import { _meta } from '../lib/metadata';
import PWAInstaller from './PWAInstaller';
import Script from 'next/script';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { GlobalTooltipProvider } from '@/components/TooltipProvider';

import './markdown.css';
import './globals.css';

const font = Lora({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
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
    <html lang='en' suppressHydrationWarning={true}>
      <Script id='pwa-script' src='/js/pwa.js' />
      <Script id='clarity-script' src='/js/clarity.js' />
      <head />
      <body className={`${font.className} scrollbar-hide`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <GlobalTooltipProvider delayDuration={300}>
            <AuthProvider>
              {maintenanceMode ? (
                <Maintenance />
              ) : (
                <>
                  <PWAInstaller>{children}</PWAInstaller>
                  <FeaturePopup />
                </>
              )}
              <AnalyticsWrapper />
            </AuthProvider>
          </GlobalTooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
