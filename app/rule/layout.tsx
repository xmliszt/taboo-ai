import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules',
  alternates: {
    canonical: '/rule',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className='flex justify-center'>{children}</section>;
}
