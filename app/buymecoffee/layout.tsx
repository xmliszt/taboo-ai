import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Me Coffee',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
