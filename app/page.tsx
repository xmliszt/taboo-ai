import Link from 'next/link';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import CustomWordListLink from './(components)/CustomWordListLink';
import Footer from './(components)/Footer';

export default function HomePage() {
  const title = 'Taboo.AI';

  return (
    <main className='h-full w-full overflow-auto'>
      <Link
        href='/rule'
        aria-label='Link to rule page'
        className='text-white dark:text-neon-red-light text-xl lg:text-3xl fixed z-40 top-5 right-5 hover:animate-pulse'
      >
        <div className='flex flex-row gap-2'>
          <span className='text-sm lg:text-lg'>How To Play</span>
          <BsFillQuestionDiamondFill data-testid='rule-icon' />
        </div>
      </Link>
      <section className='flex flex-col justify-center items-center h-full w-screen gap-8 lg:gap-16'>
        <h1
          data-testid='heading-title'
          className='text-center text-4xl lg:text-8xl drop-shadow-lg'
        >
          {title}{' '}
          <Link
            className='absolute w-full -top-10 left-1/2 lg:-top-12 lg:-right-16 text-base lg:text-2xl text-yellow dark:text-neon-yellow animate-bounce hover:text-red-light hover:dark:text-neon-red transition-colors ease-in-out'
            href='/whatsnew'
          >
            What&apos;s New?
          </Link>
          {/* <span className='text-lg text-white-faded dark:text-neon-white'>
            BETA
          </span> */}
        </h1>
        <Link
          id='start'
          href='/levels'
          data-testid='link-start'
          className='text-2xl px-8 py-2'
        >
          Choose Topics
        </Link>
        <CustomWordListLink />
      </section>
      <Footer />
    </main>
  );
}
