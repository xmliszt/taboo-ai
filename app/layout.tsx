/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Metadata, Viewport } from 'next';
import { Lora } from 'next/font/google';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AnalyticsProvider } from '@/components/analytics-provider';
import FeaturePopup from '@/components/custom/globals/feature-popup/feature-popup';
import { SignInErrorDialog } from '@/components/custom/globals/sign-in-error-dialog';
import SignInReminderDialog from '@/components/custom/globals/sign-in-reminder-dialog';
import Maintenance from '@/components/custom/maintenance';
import PWAInstaller from '@/components/custom/pwa-installer';
import SideMenu from '@/components/custom/side-menu';
import { Toaster } from '@/components/ui/sonner';
import { _meta } from '@/lib/metadata';

import './markdown.css';
import './globals.css';

import React from 'react';
import { LogSnagProvider } from '@logsnag/next';

import { AuthProvider } from '@/components/auth-provider';
import { AskForFeedbackDialog } from '@/components/custom/ask-for-feedback-auto-dialog';
import GenericAlertDialog from '@/components/custom/globals/generic-alert-dialog';
import GenericFeedbackDialog from '@/components/custom/globals/generic-feedback-dialog';
import Header from '@/components/header';
import { Providers } from '@/components/providers';
import { ReactQueryProvider } from '@/components/query-provider';

import { fetchUserProfile } from './profile/server/fetch-user-profile';

const font = Lora({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
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
      <html lang='en' suppressHydrationWarning={true}>
        <head>
          <LogSnagProvider token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN!} project='taboo-ai' />
        </head>
        <Script id='pwa-script' src='/js/pwa.js' />
        <Script id='clarity-script' src='/js/clarity.js' />
        <body className={`${font.className}`}>
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
                  <PWAInstaller />
                  <SignInErrorDialog />
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
          <SpeedInsights />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
