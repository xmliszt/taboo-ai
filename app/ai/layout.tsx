import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mode',
  alternates: {
    canonical: '/ai',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
