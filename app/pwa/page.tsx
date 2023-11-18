import ReactMarkdown from 'react-markdown';
import content from './content.md';
import InstallButton from '@/components/custom/install-button';

export default async function InstallPWAPage() {
  return (
    <main className='flex flex-col items-center'>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-24 lg:pt-32 pb-20 lg:pb-28'
      >
        <ReactMarkdown>{content}</ReactMarkdown>
        <div className='sticky z-40 bottom-4 w-full flex gap-2 justify-center px-2 mt-2'>
          <InstallButton />
        </div>
      </article>
    </main>
  );
}
