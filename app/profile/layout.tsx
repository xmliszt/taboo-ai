import React from 'react';
import { Metadata } from 'next';

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
