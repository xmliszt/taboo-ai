'use client';

import React, { useRef, useState } from 'react';
import { ChevronsUp } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LevelsScrollArea({ children }: { children: React.ReactNode }) {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const levelSectionRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToTop = () => {
    levelSectionRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('level-section')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    if (clientHeight && scrollTop > clientHeight) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };
  return (
    <ScrollArea id='level-section' ref={levelSectionRef} onScroll={onScrollChange}>
      <div
        className={
          'flex w-full flex-grow flex-wrap content-start justify-center gap-8 px-4 py-10 text-center'
        }
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
