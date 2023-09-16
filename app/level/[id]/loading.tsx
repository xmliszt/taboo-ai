import { Skeleton } from '@/components/custom/skeleton';

export default function Loading() {
  return (
    <section className='flex justify-center h-full w-full pt-20 px-4'>
      <Skeleton numberOfRows={10} />
    </section>
  );
}
