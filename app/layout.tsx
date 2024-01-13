/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Metadata } from 'next';
import { Lora } from 'next/font/google';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AnalyticsWrapper } from '@/components/analytics-wrapper';
import { AuthProvider } from '@/components/auth-provider';
import FeaturePopup from '@/components/custom/globals/feature-popup';
import { LoginErrorDialog } from '@/components/custom/globals/login-error-dialog';
import LoginReminderDialog from '@/components/custom/globals/login-reminder-dialog';
import Maintenance from '@/components/custom/maintenance';
import PWAInstaller from '@/components/custom/pwa-installer';
import SideMenu from '@/components/custom/side-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalTooltipProvider } from '@/components/tooltip-provider';
import { Toaster } from '@/components/ui/sonner';
import { _meta } from '@/lib/metadata';

import './markdown.css';
import './globals.css';

import GenericAlertDialog from '@/components/custom/globals/generic-alert-dialog';
import GenericFeedbackDialog from '@/components/custom/globals/generic-feedback-dialog';
import { NewsletterSignupDialog } from '@/components/custom/globals/newletter-signup-dialog';
import SubscriptionLockDialog from '@/components/custom/globals/subscription-lock-dialog';
import Header from '@/components/header';
import { ReactQueryProvider } from '@/components/query-provider';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const maintenanceMode = JSON.parse(process.env.NEXT_PUBLIC_MAINTENANCE || 'false');
  return (
    <ReactQueryProvider>
      <html lang='en' suppressHydrationWarning={true}>
        <Script id='pwa-script' src='/js/pwa.js' />
        <Script id='clarity-script' src='/js/clarity.js' />
        <head />
        <body className={`${font.className}`}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <GlobalTooltipProvider delayDuration={300}>
              <AuthProvider>
                {maintenanceMode ? (
                  <Maintenance />
                ) : (
                  <>
                    <Header />
                    {children}
                    {/* Below are floating components */}
                    <SideMenu />
                    <PWAInstaller />
                    <LoginErrorDialog />
                    <LoginReminderDialog />
                    <SubscriptionLockDialog />
                    <GenericAlertDialog />
                    <GenericFeedbackDialog />
                    <FeaturePopup />
                    <NewsletterSignupDialog />
                  </>
                )}
                <AnalyticsWrapper />
              </AuthProvider>
            </GlobalTooltipProvider>
            <Toaster closeButton />
          </ThemeProvider>
          <SpeedInsights />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
