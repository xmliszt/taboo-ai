import ReactMarkdown from 'react-markdown';
import content from './roadmap.md';

export default async function RoadmapPage() {
  return (
    <main className='flex flex-col items-center'>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-16 lg:pt-32 pb-4'
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
