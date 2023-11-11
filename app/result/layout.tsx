import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Results',
  alternates: {
    canonical: `/result`,
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/result',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
