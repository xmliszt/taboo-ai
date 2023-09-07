import Header from '@/components/header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex justify-center'>
      <Header isTransparent />
      {children}
    </section>
  );
}
