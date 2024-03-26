import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie policy',
  alternates: {
    canonical: '/cookie-policy',
  },
  openGraph: {
    title: 'Taboo AI: Cookie policy',
    url: 'https://taboo-ai.vercel.app/cookie-policy',
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
