import Script from 'next/script';

import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';
import HomeSocialLinkButtonArray from '@/components/custom/home/home-social-link-button-array';
import PageCounter from '@/components/custom/home/page-counter';

import ContactMe from '../components/custom/home/contact-me';

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage() {
  return (
    <main className='h-full w-full'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full flex-col items-center justify-center gap-2 pb-4 pt-24 lg:pt-24'>
        <div className='relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl drop-shadow-lg lg:text-8xl'
          >
            {title}
          </h1>
          <span className='absolute -top-6 right-0 text-lg'>{versionNumber}</span>
        </div>
        <PageCounter />
        <HomeMenuButtonArray />
        <section className='mt-10 w-11/12'>
          <ContactMe />
        </section>
        <div className='mt-6 flex w-11/12 flex-col px-4 text-center text-base text-foreground'>
          <span className='font-bold'>👇🏻 Subscribe👇🏻</span>
          <p>Receive the latest updates about Taboo AI, and many more about EdTech! 🚀</p>
        </div>
        <div className='relative mb-6 flex w-11/12 flex-col gap-4'>
          <iframe
            src='https://liyuxuan.substack.com/embed'
            width='100%'
            height='550'
            style={{ fontFamily: 'lora' }}
            className='w-full rounded-lg border-[1px] bg-card text-card-foreground shadow-lg'
            scrolling='no'
          ></iframe>
        </div>
        <HomeSocialLinkButtonArray />
        <p className='my-2 w-full px-4 text-left text-xs leading-tight text-primary'>
          We improve our products and advertising by using Microsoft Clarity to see how you use our
          website. By using our site, you agree that we and Microsoft can collect and use this data.
          Our{' '}
          <a href='/privacy' className='underline'>
            privacy statement
          </a>{' '}
          has more details.
        </p>
      </section>
    </main>
  );
}
