import Header from '@/components/header/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dev Mode: Review Topics & Words',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title='Review Topics & Words' />
      {children}
    </>
  );
}
