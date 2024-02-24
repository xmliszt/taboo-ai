import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnag/logsnag-server';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Rules',
  alternates: {
    canonical: '/rule',
  },
  openGraph: {
    title: 'Taboo AI: Rules',
    url: 'https://taboo-ai.vercel.app/rule',
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
  await trackNavigation('/rule');
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
