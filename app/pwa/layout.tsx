import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnap-server';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Install App',
  alternates: {
    canonical: '/pwa',
  },
  openGraph: {
    title: 'Taboo AI: Install App',
    url: 'https://taboo-ai.vercel.app/pwa',
    images: [
      {
        url: 'https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/poster3.0(features).png?raw=true',
        width: 800,
        height: 600,
        alt: 'Taboo AI: Ignite Learning Through Play 🚀🎮',
      },
    ],
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  await trackNavigation('/pwa');
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
