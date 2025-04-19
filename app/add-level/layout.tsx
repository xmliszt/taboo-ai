import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute Topics',
  alternates: {
    canonical: 'https://taboo-ai.com/add-level',
  },
  openGraph: {
    title: 'Taboo AI: Contribute Topics',
    url: 'https://taboo-ai.com/add-level',
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
  return <>{children}</>;
}
