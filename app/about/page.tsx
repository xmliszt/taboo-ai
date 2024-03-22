'use client';

import { SiDiscord } from 'react-icons/si';

import SocialLinkButton from '../../components/custom/social-link-button';
import AboutContent from './about.mdx';

export default function AboutPage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <article data-testid='content-article' className='max-w-xl pb-24 pt-8 leading-normal'>
        <AboutContent />
        <div className='sticky bottom-4 z-40 mt-2 flex w-full justify-center gap-2 px-2'>
          <SocialLinkButton
            content='Join Discord Community'
            icon={<SiDiscord />}
            href='https://discord.gg/dgqs29CHC2'
            newTab={true}
          />
        </div>
      </article>
    </main>
  );
}
