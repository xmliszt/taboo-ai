import { Metadata } from 'next';
import Link from 'next/link';

import { trackNavigation } from '@/lib/logsnag/logsnag-server';

export const metadata: Metadata = {
  title: 'Pricing',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Taboo AI: Pricing',
    url: 'https://taboo-ai.vercel.app/pricing',
    images: [
      {
        url: 'https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/poster3.0(features).png?raw=true',
        width: 800,
        height: 600,
        alt: 'Taboo AI: Ignite Learning Through Play 🚀🎮',
      },
    ],
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  await trackNavigation('/pricing');
  return (
    <main className='relative flex h-full w-full justify-center'>
      {children}
      <div className='absolute bottom-0 w-full p-2 text-center text-xs text-primary'>
        Powered by{' '}
        <Link href='https://www.stripe.com/' target='_blank' className='underline'>
          Stripe
        </Link>
        . Read Stripe&apos;s{' '}
        <Link href='https://stripe.com/en-US/privacy' target='_blank' className='underline'>
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href='https://stripe.com/en-gb-sg/legal/ssa' target='_blank' className='underline'>
          Terms of Service
        </Link>{' '}
        for more information.
      </div>
    </main>
  );
}
