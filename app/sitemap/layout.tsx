import { Metadata } from 'next';

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
  return children;
}
