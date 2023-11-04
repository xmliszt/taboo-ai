import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/profile',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
