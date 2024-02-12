import { Metadata } from 'next';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Taboo AI: Publications',
  alternates: {
    canonical: '/publications',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/publications',
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
