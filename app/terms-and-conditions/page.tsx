'use client';

import { useRef, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { ScrollToTopButton } from '../levels/scroll-to-top-button';
import CookiePolicyMDXContent from './content.mdx';

export default function Page() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('level-section')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrollToTopButtonVisible(scrollTop > (clientHeight ?? 0));
  };

  return (
    <ScrollArea className='h-full w-full' ref={scrollAreaRef} onScroll={onScrollChange}>
      <article className='mx-auto max-w-xl p-4'>
        <CookiePolicyMDXContent />
        {isScrollToTopButtonVisible && <ScrollToTopButton scrollAreaRef={scrollAreaRef} />}
      </article>
    </ScrollArea>
  );
}
