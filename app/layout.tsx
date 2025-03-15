import { Metadata, Viewport } from 'next';
import { Mulish } from 'next/font/google';
import Script from 'next/script';

import { AnalyticsProvider } from '@/components/analytics-provider';
import FeaturePopup from '@/components/custom/globals/feature-popup/feature-popup';
import SignInReminderDialog from '@/components/custom/globals/sign-in-reminder-dialog';
import Maintenance from '@/components/custom/maintenance';
import SideMenu from '@/components/custom/side-menu';
import { Toaster } from '@/components/ui/sonner';
import { _meta } from '@/lib/metadata';

import './markdown.css';
import './globals.css';

import React from 'react';

import { AuthProvider } from '@/components/auth-provider';
import { AskForFeedbackDialog } from '@/components/custom/ask-for-feedback-auto-dialog';
import GenericAlertDialog from '@/components/custom/globals/generic-alert-dialog';
import GenericFeedbackDialog from '@/components/custom/globals/generic-feedback-dialog';
import Header from '@/components/header';
import { Providers } from '@/components/providers';
import { ReactQueryProvider } from '@/components/query-provider';

import { fetchUserProfile } from './profile/server/fetch-user-profile';

const font = Mulish({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
  fallback: ['Inter', 'Roboto', 'sans-serif'],
  variable: '--font_family_ui',
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = _meta;
  metadata.alternates = {
    canonical: '/',
  };
  return metadata;
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--foreground))' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const maintenanceMode = JSON.parse(process.env.NEXT_PUBLIC_MAINTENANCE || 'false');
  const user = (await fetchUserProfile()) ?? undefined;
  return (
    <ReactQueryProvider>
      <html lang='en' suppressHydrationWarning>
        <Script id='pwa-script' src='/js/pwa.js' />
        <body className={`${font.className}`} suppressHydrationWarning>
          <AuthProvider user={user}>
            <Providers>
              {maintenanceMode ? (
                <Maintenance />
              ) : (
                <>
                  <Header />
                  {children}
                  {/* Below are floating components */}
                  <SideMenu />
                  {/* <PWAInstaller /> */}
                  <SignInReminderDialog />
                  <GenericAlertDialog />
                  <GenericFeedbackDialog />
                  <AskForFeedbackDialog />
                  <FeaturePopup />
                </>
              )}
            </Providers>
          </AuthProvider>
          <Toaster />
          <AnalyticsProvider />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
