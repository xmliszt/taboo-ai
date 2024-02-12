import { Metadata } from 'next';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'About Taboo AI',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/about',
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
