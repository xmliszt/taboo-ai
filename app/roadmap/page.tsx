import ReactMarkdown from 'react-markdown';

import content from './roadmap.md';

export default async function RoadmapPage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <article data-testid='content-article' className='max-w-xl pb-4 pt-8 leading-normal'>
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
