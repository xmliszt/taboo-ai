import ReactMarkdown from 'react-markdown';
import content from './roadmap.md';
import style from './style.module.css';
import Footer from '../(components)/Footer';
import Link from 'next/link';

interface RoadmapPageProps {}

export default async function RoadmapPage(props: RoadmapPageProps) {
  return (
    <section className='flex flex-col items-center'>
      <div className='h-32 fixed bottom-0 w-full z-10 gradient-up dark:gradient-up-dark-black pointer-events-none'></div>
      <Link
        href='/whatsnew'
        className='fixed top-4 text-lg z-40 underline'
        aria-label='Go to the new features page'
      >
        Revisit New Features
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
