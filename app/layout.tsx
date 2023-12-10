/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import Script from 'next/script';
import { Lora } from 'next/font/google';

import { _meta } from '@/lib/metadata';
import { AnalyticsWrapper } from '@/components/analytics-wrapper';
import FeaturePopup from '@/components/custom/globals/feature-popup';
import Maintenance from '@/components/custom/maintenance';
import PWAInstaller from '@/components/custom/pwa-installer';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import SideMenu from '@/components/custom/side-menu';
import { GlobalTooltipProvider } from '@/components/tooltip-provider';
import { LoginErrorDialog } from '@/components/custom/globals/login-error-dialog';
import LoginReminderDialog from '@/components/custom/globals/login-reminder-dialog';

import './markdown.css';
import './globals.css';
import Header from '@/components/header';
import { NewsletterSignupDialog } from '@/components/custom/globals/newletter-signup-dialog';
import SubscriptionLockDialog from '@/components/custom/globals/subscription-lock-dialog';
import GenericAlertDialog from '@/components/custom/globals/generic-alert-dialog';
import GenericFeedbackDialog from '@/components/custom/globals/generic-feedback-dialog';

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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <GlobalTooltipProvider delayDuration={300}>
            <AuthProvider>
              {maintenanceMode ? (
                <Maintenance />
              ) : (
                <>
                  <Header />
                  {children}
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
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
