'use client';

import React, { useMemo, useRef, useState } from 'react';
import { LevelCard } from '@/components/custom/level-card';
import { useLevels } from '@/lib/hooks/useLevels';
import IconButton from '@/components/ui/icon-button';
import { ChevronsUp } from 'lucide-react';
import { Skeleton } from '@/components/custom/skeleton';
import { LevelUtils, SortType } from '@/lib/utils/levelUtils';
import LevelsSearchBar from '@/components/custom/levels/levels-search-bar';

export default function LevelsPage() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const [selectedSorter, setSelectedSorter] = useState<SortType>('create-new');
  const levelSectionRef = useRef<HTMLDivElement | null>(null);
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();
  const sortedLevels = useMemo(
    () => [...filteredLevels].sort(LevelUtils.getCompareFn(selectedSorter)),
    [selectedSorter, filteredLevels]
  );

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
    <section className='w-full h-full'>
      <div className='w-full fixed z-20 left-0 top-14 lg:top-16 px-4 lg:px-12 py-4 bg-card shadow-lg'>
        <LevelsSearchBar
          topicNumber={filteredLevels.length}
          setFilterKeyword={setFilterKeyword}
          onSorterChange={(sorter: SortType) => {
            setSelectedSorter(sorter);
          }}
        />
      </div>
      <div
        id='level-section'
        ref={levelSectionRef}
        className='flex flex-wrap gap-8 w-full h-full px-10 justify-center content-start text-center pt-44 lg:pt-48 pb-16 overflow-x-hidden overflow-y-scroll scrollbar-hide'
        onScroll={onScrollChange}
      >
        <LevelCard />
        {isFetchingLevels ? (
          <Skeleton numberOfRows={8} className='flex-grow' />
        ) : (
          sortedLevels.map((level, idx) => (
            <LevelCard key={idx} level={level} />
          ))
        )}
      </div>
      {isScrollToTopButtonVisible && (
        <IconButton
          className='fixed bottom-2 right-2 animate-fade-in'
          tooltip='Scroll to top'
          onClick={handleScrollToTop}
        >
          <ChevronsUp />
        </IconButton>
      )}
    </section>
  );
}
