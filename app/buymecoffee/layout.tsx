import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Me Coffee',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isTransparent />
      {children}
      <Footer />
    </>
  );
}
