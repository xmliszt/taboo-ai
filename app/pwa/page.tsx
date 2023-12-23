import ReactMarkdown from 'react-markdown';

import InstallButton from '@/components/custom/install-button';

import content from './content.md';

export default async function InstallPWAPage() {
  return (
    <main className='flex flex-col items-center'>
      <article data-testid='content-article' className='w-10/12 pb-20 pt-8 leading-normal lg:pb-28'>
        <ReactMarkdown>{content}</ReactMarkdown>
        <div className='sticky bottom-4 z-40 mt-2 flex w-full justify-center gap-2 px-2'>
          <InstallButton />
        </div>
      </article>
    </main>
  );
}
