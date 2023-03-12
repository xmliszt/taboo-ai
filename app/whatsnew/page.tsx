import BackButton from '../(components)/BackButton';
import ReactMarkdown from 'react-markdown';
import content from './whatsnew.md';
import style from './style.module.css';
import Footer from '../(components)/Footer';
import Link from 'next/link';

interface WhatsNewPageProps {}

export default async function WhatsNewPage(props: WhatsNewPageProps) {
  return (
    <section className='flex flex-col items-center'>
      <BackButton href='/' />
      <div className='h-32 fixed top-0 w-full z-10 gradient-down dark:gradient-down-dark- pointer-events-none'></div>
      <div className='h-32 fixed bottom-0 w-full z-10 gradient-up dark:gradient-up-dark-black pointer-events-none'></div>
      <Link
        href='/upcoming'
        aria-label='Link to see upcoming features'
        className='h-32 fixed top-0 z-10 leading-normal text-white pt-4 text-xl underline underline-offset-2 hover:text-yellow transition-colors dark:text-neon-white hover:dark:text-neon-yellow'
      >
        See Upcoming Features
      </Link>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-24 lg:pt-32 pb-20'
      >
        <ReactMarkdown className={`${style.markdown}`}>{content}</ReactMarkdown>
      </article>
      <Footer />
    </section>
  );
}
