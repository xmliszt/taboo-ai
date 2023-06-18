import DevToggle from '../../components/DevToggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Level',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const environment = process.env.VERCEL_ENV;
  return (
    <>
      <section className='fixed top-36 z-50 w-full flex justify-center align-top h-fit'>
        {environment !== 'production' && <DevToggle />}
      </section>
      children
    </>
  );
}
