import { TbBrandNextjs } from 'react-icons/tb';
import { SiOpenai } from 'react-icons/si';
import { FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer
      data-testid='footer'
      className='w-full h-12 rounded-t-2xl dark:drop-shadow-[0_-10px_30px_rgba(0,0,0,1)] flex justify-center items-center bg-gray dark:bg-neon-gray fixed bottom-0 z-50 text-white dark:text-neon-white lg:text-white-faded lg:dark:text-neon-white text-center text-xs lg:text-lg'
    >
      <article className='flex-grow px-2'>
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
    </footer>
  );
}
