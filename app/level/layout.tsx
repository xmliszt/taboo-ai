import DevToggle from '../../components/custom/dev-toggle';
import { Metadata } from 'next';
import Header from '@/components/header/Header';
export const metadata: Metadata = {
  title: 'Level',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className='fixed top-36 z-50 w-full flex justify-center align-top h-fit'>
        <DevToggle />
      </section>
      <Header hideMenu isTransparent hasBackButton hideUserMenu />
      {children}
    </>
  );
}
