import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Results',
  alternates: {
    canonical: '/result',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
