import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Roadmap',
  alternates: {
    canonical: '/roadmap',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/roadmap',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
