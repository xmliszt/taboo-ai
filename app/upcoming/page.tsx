import BackButton from '../(components)/BackButton';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import style from './style.module.css';
import Footer from '../(components)/Footer';
import Link from 'next/link';

interface UpcomingPageProps {}

export default async function Upcoming(props: UpcomingPageProps) {
  return (
    <section className='flex justify-center'>
      <BackButton href='/' />
      <div className='h-32 fixed top-0 w-full z-10 gradient-down dark:gradient-down-dark- pointer-events-none'></div>
      <div className='h-32 fixed bottom-0 w-full z-10 gradient-up dark:gradient-up-dark-black pointer-events-none'></div>
      <Link
        href='/whatsnew'
        aria-label='Link to see latest new updates'
        className='h-32 fixed top-0 z-10 leading-normal text-white pt-4 text-xl underline underline-offset-2 hover:text-yellow transition-colors dark:text-neon-white hover:dark:text-neon-yellow'
      >
        See Latest New Updates
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
