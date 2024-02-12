import { Metadata } from 'next';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Sitemap',
  alternates: {
    canonical: '/sitemap',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/sitemap',
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
