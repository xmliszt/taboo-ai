'use client';

import React, { useRef, useState } from 'react';
import { ChevronsUp } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function LevelsScrollArea({ children }: { children: React.ReactNode }) {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const levelSectionRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToTop = () => {
    levelSectionRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('level-section')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrollToTopButtonVisible(scrollTop > (clientHeight ?? 0));
  };
  return (
    <ScrollArea id='level-section' ref={levelSectionRef} onScroll={onScrollChange}>
      <div
        className={cn(
          'flex w-full flex-col flex-nowrap items-stretch gap-8 px-8 py-10 text-center',
          'xs:flex-grow xs:flex-row xs:flex-wrap xs:content-start xs:justify-center xs:px-4'
        )}
      >
        {children}
        {isScrollToTopButtonVisible && (
          <IconButton
            asChild
            className='fixed bottom-4 right-8 animate-fade-in'
            tooltip='Scroll to top'
            onClick={handleScrollToTop}
          >
            <ChevronsUp />
          </IconButton>
        )}
      </div>
    </ScrollArea>
  );
}
