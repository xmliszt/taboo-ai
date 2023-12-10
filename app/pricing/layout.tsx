import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/pricing',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className='flex justify-center w-full h-full'>{children}</main>;
}
