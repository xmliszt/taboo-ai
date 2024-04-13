import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & conditions',
  alternates: {
    canonical: '/terms-and-conditions',
  },
  openGraph: {
    title: 'Taboo AI: Terms & conditions',
    url: 'https://taboo-ai.com/terms-and-conditions',
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
