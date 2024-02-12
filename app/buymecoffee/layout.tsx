import { Metadata } from 'next';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Buy Me Coffee',
  alternates: {
    canonical: '/buymecoffee',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/buymecoffee',
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
