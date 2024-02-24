import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnap-server';

export const metadata: Metadata = {
  title: 'Your Results',
  alternates: {
    canonical: `/result`,
  },
  openGraph: {
    title: 'Taboo AI: Your Results',
    url: 'https://taboo-ai.vercel.app/result',
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
  await trackNavigation('/result');
  return <>{children}</>;
}
