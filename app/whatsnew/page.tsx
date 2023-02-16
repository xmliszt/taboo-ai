import BackButton from '../(components)/BackButton';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import style from './style.module.css';
import Footer from '../(components)/Footer';

export default async function WhatsNewPage() {
  return (
    <section className='flex justify-center'>
      <BackButton href='/' />
      <div className='h-32 fixed top-0 w-full z-10 gradient-down dark:gradient-down-dark-black'></div>
      <div className='h-32 fixed bottom-0 w-full z-10 gradient-up dark:gradient-up-dark-black'></div>
      <article className='leading-normal w-10/12 pt-24 lg:pt-32 pb-20'>
        <ReactMarkdown className={`${style.markdown}`}>{content}</ReactMarkdown>
      </article>
      <Footer />
    </section>
  );
}
