import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gem shop',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Taboo AI: Gem shop',
    description: 'Buy more gems to play!',
    url: 'https://taboo-ai.com/shop',
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

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
