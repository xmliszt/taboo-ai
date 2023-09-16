import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Topic',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex justify-center w-full h-full'>{children}</section>
  );
}
