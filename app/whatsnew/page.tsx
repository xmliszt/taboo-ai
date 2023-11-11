import ReactMarkdown from 'react-markdown';
import content from '../../public/features/content.md';
import SocialLinkButton from '../../components/custom/social-link-button';
import { SiDiscord } from 'react-icons/si';

export default async function WhatsNewPage() {
  return (
    <section className='flex flex-col items-center'>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-16 lg:pt-32 pb-24'
      >
        <ReactMarkdown>{content}</ReactMarkdown>
        <div className='sticky z-40 bottom-4 w-full flex gap-2 justify-center px-2 mt-2'>
          <SocialLinkButton
            content='Join Discord Community'
            icon={<SiDiscord />}
            href='https://discord.gg/dgqs29CHC2'
            newTab={true}
          />
        </div>
      </article>
    </section>
  );
}
