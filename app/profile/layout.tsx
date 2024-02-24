import React from 'react';
import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnag/logsnag-server';

export const metadata: Metadata = {
  title: 'My Profile',
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    title: 'Taboo AI: My Profile',
    url: 'https://taboo-ai.vercel.app/profile',
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
  await trackNavigation('/profile');
  return <>{children}</>;
}
