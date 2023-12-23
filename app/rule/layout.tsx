import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules',
  alternates: {
    canonical: '/rule',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/rule',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
