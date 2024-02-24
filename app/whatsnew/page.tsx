import { SiDiscord } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';

import SocialLinkButton from '../../components/custom/social-link-button';
import content from '../../public/features/content.md';

export default async function WhatsNewPage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <article data-testid='content-article' className='max-w-xl pb-24 pt-8 leading-normal'>
        <ReactMarkdown>{content}</ReactMarkdown>
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
