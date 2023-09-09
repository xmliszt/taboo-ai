'use client';

import React, { useRef, useState } from 'react';
import { LevelCard } from '@/components/custom/level-card';
import { useLevels } from '@/lib/hooks/useLevels';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isMobile } from 'react-device-detect';
import IconButton from '@/components/ui/icon-button';
import { ChevronsUp, Circle } from 'lucide-react';
import { Skeleton } from '@/components/custom/skeleton';

export default function LevelsPage() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const levelSectionRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();

  const clearSearch = () => {
    setSearchTerm('');
    setFilterKeyword('');
  };

  const handleScrollToTop = () => {
    levelSectionRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('level-section')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    console.log(clientHeight, scrollTop);
    if (clientHeight && scrollTop > clientHeight) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };

  return (
    <section className='w-full h-full'>
      <div className='w-full fixed z-20 left-0 top-14 lg:top-20 px-4 lg:px-12 py-4 bg-card shadow-lg'>
        <div className='flex flex-row gap-4 items-center'>
          <Input
            className='w-full'
            placeholder='Search by topic name or author...'
            value={searchTerm}
            type='text'
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilterKeyword(e.target.value);
            }}
          />
          {!isMobile && searchTerm.length > 0 && (
            <Button className='animate-fade-in' onClick={clearSearch}>
              Clear
            </Button>
          )}
        </div>
        {searchTerm && searchTerm.length > 0 && (
          <Badge className='mt-3 shadow-[0_5px_20px_rgba(0,0,0,0.7)]'>
            Found {filteredLevels.length} topics
          </Badge>
        )}
      </div>
      <div
        id='level-section'
        ref={levelSectionRef}
        className='flex flex-wrap gap-8 w-full h-full px-10 justify-center content-start text-center pt-36 lg:pt-44 pb-16 overflow-x-hidden overflow-y-scroll scrollbar-hide'
        onScroll={onScrollChange}
      >
        <LevelCard />
        {isFetchingLevels ? (
          <Skeleton numberOfRows={6} />
        ) : (
          filteredLevels.map((level, idx) => (
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
