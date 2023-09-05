import { Github } from 'lucide-react';
import Link from 'next/link';
import { SiNextdotjs, SiOpenai } from 'react-icons/si';

export default function Footer() {
  return (
    <footer
      data-testid='footer'
      className='py-3 w-full h-auto rounded-t-2xl shadow-[0_-15px_30px_rgba(0,0,0,0.4)] flex flex-col gap-0 justify-center items-center fixed bottom-0 z-50 text-center text-xs lg:text-lg bg-primary text-primary-foreground'
    >
      <section className='px-1 w-full text-[0.5rem] lg:text-xs leading-tight text-center absolute -top-[20px]'>
        <p className='text-primary'>
          We improve our products and advertising by using Microsoft Clarity to
          see how you use our website. By using our site, you agree that we and
          Microsoft can collect and use this data. Our{' '}
          <Link href='/privacy' className='underline'>
            privacy statement
          </Link>{' '}
          has more details.
        </p>
      </section>
      <div className='px-2'>
        Powered by{' '}
        <a
          aria-label='Read more about Next.JS on its official website'
          href='https://beta.nextjs.org/docs/getting-started'
          target='__blank'
          className='underline '
        >
          Next.JS <SiNextdotjs className='inline' />
        </a>{' '}
        &{' '}
        <a
          aria-label='Read more about OpenAI APi on its official website'
          href='https://openai.com/api/'
          target='__blank'
          className='underline '
        >
          OpenAI API <SiOpenai className='inline' />
        </a>{' '}
        | Developed by{' '}
        <a
          aria-label="Go to Li Yuxuan's personal portfolio page"
          href='https://xmliszt.github.io/'
          target='__blank'
          className='underline '
        >
          Li Yuxuan <Github className='inline' />
        </a>
      </div>
      <article className='px-2 flex flex-row gap-2'>
        <a
          aria-label='Read more about the Privacy Policy'
          href='/privacy'
          className='underline '
        >
          Privacy Policy
        </a>
        <a
          aria-label='Read more about the Cookie Policy'
          href='/cookie-policy'
          className='underline  '
        >
          Cookie Policy
        </a>
        <a
          aria-label='Read Taboo AI features'
          href='/whatsnew'
          className='underline '
        >
          Features
        </a>
        <a
          aria-label='Read Taboo AI releases roadmap'
          href='/roadmap'
          className='underline '
        >
          Releases Roadmap
        </a>
      </article>
    </footer>
  );
}
