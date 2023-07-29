import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Topic',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex justify-center'>
      <h1
        data-testid='levels-heading-title'
        className='fixed top-0 z-50 h-20 text-center pt-4 pointer-events-none'
      >
        Choose A Topic
      </h1>
      {children}
    </section>
  );
}
