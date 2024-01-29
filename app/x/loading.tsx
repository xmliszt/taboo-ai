import { Skeleton } from '@/components/custom/skeleton';

export default function Loading() {
  return (
    <section className='flex h-full justify-center p-4'>
      <Skeleton numberOfRows={10} />
    </section>
  );
}
