import { Skeleton } from '@/components/custom/skeleton';

export default function Loading() {
  return (
    <section className='flex h-full justify-center px-4 pt-20'>
      <Skeleton numberOfRows={10} />
    </section>
  );
}
