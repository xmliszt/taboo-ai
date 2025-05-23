import Script from 'next/script';

import { OutgoingLinksCarousel } from '@/app/outgoing-links-carousel';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';

export default async function HomePage() {
  return (
    <main className='flex flex-col items-center justify-between'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full grow flex-col items-center justify-center gap-2 px-8 pb-4 pt-8'>
        <h1
          data-testid='heading-title'
          className='line-clamp-1 select-none text-center text-6xl font-extrabold drop-shadow-lg'
        >
          Taboo AI
        </h1>
        <HomeMenuButtonArray />
      </section>
      <footer className='w-full pb-6 text-center text-xs leading-tight text-muted-foreground'>
        <OutgoingLinksCarousel />
      </footer>
    </main>
  );
}
