import Link from 'next/link';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import { TbBrandNextjs } from 'react-icons/tb';
import { SiOpenai } from 'react-icons/si';
import { FiGithub } from 'react-icons/fi';
import BetaFeedback from './(components)/BetaFeedback';

export default function HomePage() {
  const title = 'Taboo.AI';

  return (
    <main className='h-full w-full overflow-auto'>
      <Link
        href='/rule'
        className='text-white dark:text-neon-red-light text-xl lg:text-3xl fixed z-40 top-5 right-5 hover:animate-pulse'
      >
        <BsFillQuestionDiamondFill data-testid='rule-icon' />
      </Link>
      <section className='flex flex-col justify-center items-center h-full w-screen gap-8 lg:gap-16'>
        <h1
          data-testid='heading-title'
          className='text-center text-4xl lg:text-8xl drop-shadow-lg'
        >
          {title}{' '}
          <span className='text-lg text-white-faded dark:text-neon-white'>
            BETA
          </span>
        </h1>
        <Link
          id='start'
          href='/levels'
          data-testid='link-start'
          className='text-2xl px-8 py-2'
        >
          START
        </Link>
        <BetaFeedback />
      </section>
      <footer
        data-testid='footer'
        className='w-full h-12 rounded-t-2xl dark:drop-shadow-[0_-10px_30px_rgba(0,0,0,1)] flex justify-center items-center bg-gray dark:bg-neon-gray fixed bottom-0 text-white dark:text-neon-white lg:text-white-faded lg:dark:text-neon-white text-center text-[10px] lg:text-lg'
      >
        <article className='flex-grow px-2'>
          Powered by{' '}
          <a
            href='https://beta.nextjs.org/docs/getting-started'
            target='__blank'
            className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
          >
            Next.JS <TbBrandNextjs className='inline' />
          </a>{' '}
          &{' '}
          <a
            href='https://openai.com/api/'
            target='__blank'
            className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
          >
            OpenAI API <SiOpenai className='inline' />
          </a>{' '}
          | Developed by{' '}
          <a
            href='https://xmliszt.github.io/'
            target='__blank'
            className='underline text-white dark:text-neon-blue lg:hover:text-white lg:hover:dark:text-neon-red transition-colors'
          >
            Li Yuxuan <FiGithub className='inline' />
          </a>
        </article>
      </footer>
    </main>
  );
}
