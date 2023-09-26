import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute Topics',
  alternates: {
    canonical: '/add-level',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/add-level',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
