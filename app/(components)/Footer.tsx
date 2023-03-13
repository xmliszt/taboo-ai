'use client';

import { TbBrandNextjs } from 'react-icons/tb';
import { SiOpenai } from 'react-icons/si';
import { FiGithub } from 'react-icons/fi';

declare global {
  interface Window {
    displayPreferenceModal: () => void;
  }
}

export default function Footer() {
  return (
    <footer
      data-testid='footer'
      className='w-full h-12 rounded-t-2xl dark:drop-shadow-[0_-10px_30px_rgba(0,0,0,1)] flex flex-col gap-0 justify-center items-center bg-gray dark:bg-neon-gray fixed bottom-0 z-50 text-white dark:text-neon-white lg:text-white-faded lg:dark:text-neon-white text-center text-xs lg:text-lg'
    >
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
          aria-label='Open Preference Center to manage cookies'
          href='#'
          onClick={(e) => {
            e.preventDefault();
            window.displayPreferenceModal();
            return false;
          }}
          id='termly-consent-preferences'
          className='underline text-white dark:text-neon-blue lg:hover:text-white lg:hover:dark:text-neon-red transition-colors'
        >
          Consent Preferences
        </a>
      </article>
    </footer>
  );
}
