import Header from '@/components/header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mode',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title='AI Generated Topic' hasBackButton hideMenu />
      {children}
    </>
  );
}
