import { Grenze } from 'next/font/google';
import { AnalyticsWrapper } from '../components/AnalayticsWrapper';
import FeaturePopup from '../components/FeaturePopup/FeaturePopup';
import { ThemeProvider } from './ThemeProvider';
import Header from '../components/Header';
import Maintenance from '../components/Maintenance';
import { Metadata } from 'next';
import { _meta } from '../lib/metadata';

import './global.css';
import './main.css';

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
      <head />
      <body className={`${font.className} bg-black text-white`}>
        <ThemeProvider>
          <Header maintenanceOn={maintenanceMode} />
          {maintenanceMode && <Maintenance />}
          {!maintenanceMode && children}
          {!maintenanceMode && <FeaturePopup />}
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
