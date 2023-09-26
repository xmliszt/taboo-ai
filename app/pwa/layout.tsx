import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taboo AI: Install App',
  alternates: {
    canonical: '/pwa',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/pwa',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
