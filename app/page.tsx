import Link from 'next/link';
import Script from 'next/script';
import { SetUserIdServerComponent } from '@logsnag/next';

import { OutgoingLinksCarousel } from '@/app/outgoing-links-carousel';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';

export default async function HomePage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full flex-col items-center justify-center gap-2 pb-4 pt-8'>
        <div className='relative'>
          <h1 data-testid='heading-title' className='text-center text-7xl drop-shadow-lg'>
            Taboo AI
          </h1>
        </div>
        <div>
          <p className='w-80 text-center text-xs'>
            {`We've got a new domain! Try out `}
            <Link
              className='font-semibold underline'
              href={'https://taboo-ai.com'}
            >{`https://taboo-ai.com`}</Link>
          </p>
        </div>
        <HomeMenuButtonArray />
      </section>
      <footer className='w-full max-w-xl px-4 pb-2 text-center text-xs leading-tight'>
        <OutgoingLinksCarousel />
        We improve our products and advertising by using Microsoft Clarity to see how you use our
        website. By using our site, you agree that we and Microsoft can collect and use this data.
        Our{' '}
        <a href='/privacy-policy' className='underline'>
          privacy statement
        </a>{' '}
        has more details.
      </footer>
      {process.env.VERCEL_ENV === 'production' && (
        <SetUserIdServerComponent userId={(await fetchUserProfile())?.id ?? null} />
      )}
    </main>
  );
}
