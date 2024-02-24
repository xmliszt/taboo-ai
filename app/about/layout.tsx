import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnap-server';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'About Taboo AI',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Taboo AI: About',
    url: 'https://taboo-ai.vercel.app/about',
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
  await trackNavigation('/about');
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
