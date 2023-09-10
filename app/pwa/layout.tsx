import Header from '@/components/header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taboo AI: Install App',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isTransparent />
      {children}
    </>
  );
}
