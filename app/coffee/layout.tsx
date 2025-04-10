import { Metadata } from 'next';

import { Footer } from '../footer';
import { _meta } from '@/lib/metadata';

export const metadata: Metadata = {
  ..._meta,
  title: 'Buy me a coffee',
  alternates: {
    canonical: '/coffee',
  },
  openGraph: {
    title: 'Buy me a coffee',
    url: 'https://taboo-ai.com/coffee',
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
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
