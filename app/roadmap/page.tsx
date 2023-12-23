import ReactMarkdown from 'react-markdown';

import content from './roadmap.md';

export default async function RoadmapPage() {
  return (
    <main className='flex flex-col items-center'>
      <article data-testid='content-article' className='w-10/12 pb-4 pt-8 leading-normal'>
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
