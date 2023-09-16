import Header from '@/components/header/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute Topics',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title='Contribute Topics' />
      {children}
    </>
  );
}
