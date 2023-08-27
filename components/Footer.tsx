import { TbBrandNextjs } from 'react-icons/tb';
import { SiOpenai } from 'react-icons/si';
import { FiGithub } from 'react-icons/fi';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      data-testid='footer'
      className='py-3 w-full h-auto rounded-t-2xl shadow-[0_-15px_30px_rgba(0,0,0,0.4)] flex flex-col gap-0 justify-center items-center bg-black-darker fixed bottom-0 z-50 text-white lg:text-white-faded text-center text-xs lg:text-lg'
    >
      <section className='px-1 w-full text-[0.5rem] lg:text-xs leading-tight text-center text-white-faded absolute -top-[20px]'>
        We improve our products and advertising by using Microsoft Clarity to
        see how you use our website. By using our site, you agree that we and
        Microsoft can collect and use this data. Our{' '}
        <Link href='/privacy' className='underline text-white'>
          privacy statement
        </Link>{' '}
        has more details.
      </section>
      <article className='px-2'>
        Powered by{' '}
        <a
          aria-label='Read more about Next.JS on its official website'
          href='https://beta.nextjs.org/docs/getting-started'
          target='__blank'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          Next.JS <TbBrandNextjs className='inline' />
        </a>{' '}
        &{' '}
        <a
          aria-label='Read more about OpenAI APi on its official website'
          href='https://openai.com/api/'
          target='__blank'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          OpenAI API <SiOpenai className='inline' />
        </a>{' '}
        | Developed by{' '}
        <a
          aria-label="Go to Li Yuxuan's personal portfolio page"
          href='https://xmliszt.github.io/'
          target='__blank'
          className='underline text-white dark:text-neon-blue lg:hover:text-white lg:hover:dark:text-neon-red transition-colors'
        >
          Li Yuxuan <FiGithub className='inline' />
        </a>
      </article>
      <article className='px-2 flex flex-row gap-2'>
        <a
          aria-label='Read more about the Privacy Policy'
          href='/privacy'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          Privacy Policy
        </a>
        <a
          aria-label='Read more about the Cookie Policy'
          href='/cookie-policy'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          Cookie Policy
        </a>
        <a
          aria-label='Read Taboo AI features'
          href='/whatsnew'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          Features
        </a>
        <a
          aria-label='Read Taboo AI releases roadmap'
          href='/roadmap'
          className='underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors'
        >
          Releases Roadmap
        </a>
      </article>
    </footer>
  );
}
