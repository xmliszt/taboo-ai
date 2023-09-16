import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mode',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
