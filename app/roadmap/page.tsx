import ReactMarkdown from 'react-markdown';
import content from './roadmap.md';

interface RoadmapPageProps {}

export default async function RoadmapPage(props: RoadmapPageProps) {
  return (
    <section className='flex flex-col items-center'>
      <article
        data-testid='content-article'
        className='leading-normal w-10/12 pt-16 lg:pt-32 pb-4'
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </section>
  );
}
