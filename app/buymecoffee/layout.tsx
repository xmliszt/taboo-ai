import { Metadata } from 'next';

import { Footer } from '../footer';

export const metadata: Metadata = {
  title: 'Buy Me Coffee',
  alternates: {
    canonical: '/buymecoffee',
  },
  openGraph: {
    title: 'Taboo AI: Buy Me Coffee',
    url: 'https://taboo-ai.vercel.app/buymecoffee',
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
