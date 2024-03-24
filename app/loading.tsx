'use client';

import { TabooAILoadingEffect } from '@/components/custom/globals/taboo-ai-loading-effect';

export default function Loading() {
  return (
    <div className='fixed left-0 top-0 z-[1000] flex h-screen w-screen animate-fade-in items-center justify-center backdrop-blur-lg backdrop-brightness-[15%]'>
      <TabooAILoadingEffect className='[&>#taboo-ai-logo-svg-stroke_path]:!stroke-white' />
    </div>
  );
}
