import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Taboo AI: Privacy policy',
    url: 'https://taboo-ai.com/privacy-policy',
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

export default function Layout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
