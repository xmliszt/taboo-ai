import { TabooAILoadingEffect } from '@/components/custom/globals/taboo-ai-loading-effect';

export default function Loading() {
  return (
    <section className='flex h-full items-center justify-center p-4'>
      <TabooAILoadingEffect />
    </section>
  );
}
