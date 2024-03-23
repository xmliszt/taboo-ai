import RoadmapMDX from 'mdx-contents/roadmap.mdx';

export default async function RoadmapPage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <article data-testid='content-article' className='max-w-xl pb-4 pt-8 leading-normal'>
        <RoadmapMDX />
      </article>
    </main>
  );
}
