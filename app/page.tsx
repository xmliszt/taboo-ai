import Script from 'next/script';
import ContactMe from '../components/custom/home/contact-me';
import PageCounter from '@/components/custom/home/page-counter';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';
import HomeSocialLinkButtonArray from '@/components/custom/home/home-social-link-button-array';

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage() {
  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 pt-24 lg:pt-24 pb-4'>
        <div className='relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl lg:text-8xl drop-shadow-lg'
          >
            {title}
          </h1>
          <span className='text-lg absolute -top-6 right-0'>
            {versionNumber}
          </span>
        </div>
        <PageCounter />
        <HomeMenuButtonArray />
        <section className='mt-10 w-11/12'>
          <ContactMe />
        </section>
        <div className='w-11/12 mt-6 flex flex-col px-4 text-base text-center text-black'>
          <span className='font-bold'>👇🏻 Subscribe👇🏻</span>
          <p>
            Receive the latest updates about Taboo AI, and many more about
            EdTech! 🚀
          </p>
        </div>
        <div className='mb-6 w-11/12 flex flex-col gap-4 relative'>
          <iframe
            src='https://liyuxuan.substack.com/embed'
            width='100%'
            height='550'
            style={{ fontFamily: 'lora' }}
            className='border-[1px] rounded-lg bg-card text-card-foreground w-full shadow-lg'
            scrolling='no'
          ></iframe>
        </div>
        <HomeSocialLinkButtonArray />
        <p className='px-4 my-2 w-full text-primary text-xs leading-tight text-left'>
          We improve our products and advertising by using Microsoft Clarity to
          see how you use our website. By using our site, you agree that we and
          Microsoft can collect and use this data. Our{' '}
          <a href='/privacy' className='underline'>
            privacy statement
          </a>{' '}
          has more details.
        </p>
      </section>
    </main>
  );
}
