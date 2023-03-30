import ReactMarkdown from 'react-markdown';
import content from '../../public/features/content.md';
import style from './style.module.css';
import Footer from '../(components)/Footer';
import SocialLinkButton from '../(components)/SocialLinkButton';
import { SiDiscord } from 'react-icons/si';
import Link from 'next/link';

interface WhatsNewPageProps {}

export default async function WhatsNewPage(props: WhatsNewPageProps) {
  return (
    <section className='flex flex-col items-center'>
      <div className='h-32 fixed bottom-0 w-full z-10 gradient-up dark:gradient-up-dark-black pointer-events-none'></div>
      <Link
        href='/roadmap'
        className='fixed top-4 z-40 underline text-lg'
        aria-label='Go to the Taboo AI releases roadmap page'
      >
        Taboo.AI Releases Roadmap
      </Link>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-24 lg:pt-32 pb-24'
      >
        <ReactMarkdown className={`${style.markdown}`}>{content}</ReactMarkdown>
        <div className='sticky z-40 bottom-14 w-full flex gap-2 justify-center px-2 mt-2'>
          <SocialLinkButton
            content='Join our Discord for more updates!'
            icon={<SiDiscord />}
            href='https://discord.gg/dgqs29CHC2'
            newTab={true}
            accentColorClass='bg-purple dark:bg-neon-purple'
            dropShadowClass='hover:drop-shadow-[0_5px_15px_rgba(224,158,255,0.6)]'
          />
        </div>
      </article>
      <Footer />
    </section>
  );
}
