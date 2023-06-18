import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Results',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
