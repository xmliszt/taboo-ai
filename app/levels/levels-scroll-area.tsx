'use client';

import React, { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { Confetti } from '../checkout/success/[session_id]/confetti';
import { ScrollToTopButton } from './scroll-to-top-button';

export function LevelsScrollArea({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isHallOfFameOn = searchParams.has('rank');

  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const levelSectionRef = useRef<HTMLDivElement | null>(null);

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
        {isScrollToTopButtonVisible && <ScrollToTopButton scrollAreaRef={levelSectionRef} />}
      </div>
      {isHallOfFameOn && <Confetti playOnce />}
    </ScrollArea>
  );
}
