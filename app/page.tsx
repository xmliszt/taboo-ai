import Script from 'next/script';

import { OutgoingLinksCarousel } from '@/app/outgoing-links-carousel';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';

export default async function HomePage() {
  return (
    <main className='flex flex-col items-center justify-between px-8'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full grow flex-col items-center justify-center gap-2 pb-4 pt-8'>
        <div className='relative'>
          <h1
            data-testid='heading-title'
            className='select-none truncate text-center text-6xl font-medium drop-shadow-lg'
          >
            Taboo AI
          </h1>
        </div>
        <HomeMenuButtonArray />
      </section>
      <footer className='w-full max-w-xl px-4 pb-6 text-center text-xs leading-tight text-muted-foreground'>
        <OutgoingLinksCarousel />
      </footer>
    </main>
  );
}
