'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LevelCard } from '@/components/custom/level-card';
import { useLevels } from '@/lib/hooks/useLevels';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isMobile } from 'react-device-detect';
import IconButton from '@/components/ui/icon-button';
import { ChevronsUp } from 'lucide-react';
import { Skeleton } from '@/components/custom/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ILevel from '@/lib/types/level.interface';
import { LevelUtils, SortType } from '@/lib/utils/levelUtils';
interface SortItem {
  value: SortType;
  label: string;
}
const sorters: SortItem[] = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'create-old', label: 'Oldest First' },
  { value: 'create-new', label: 'Newest First' },
  { value: 'most-popular', label: 'Most Popular First' },
  { value: 'least-popular', label: 'Least Popular First' },
];

export default function LevelsPage() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const levelSectionRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();
  const [selectedSorter, setSelectedSorter] = useState<SortType>('create-new');
  const [sortedLevels, setSortedLevels] = useState<ILevel[]>([]);

  useEffect(() => {
    const copyLevels = [...filteredLevels];
    copyLevels.sort(LevelUtils.getCompareFn(selectedSorter));
    setSortedLevels(copyLevels);
  }, [selectedSorter, filteredLevels]);

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
    if (clientHeight && scrollTop > clientHeight) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };

  return (
    <section className='w-full h-full'>
      <div className='w-full fixed z-20 left-0 top-14 lg:top-16 px-4 lg:px-12 py-4 bg-card shadow-lg'>
        <div className='flex flex-row gap-4 items-center'>
          <Select
            value={selectedSorter}
            onValueChange={(value) => {
              setSelectedSorter(value as SortType);
            }}
          >
            <SelectTrigger className='w-[250px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)]'>
              <SelectGroup>
                <SelectLabel>Sort Topics</SelectLabel>
                {sorters.map((sorter, idx) => (
                  <SelectItem key={idx} value={sorter.value}>
                    {sorter.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            className='w-full !text-sm'
            placeholder='Search by name/author'
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
        <Badge className='mt-3 shadow-[0_5px_20px_rgba(0,0,0,0.7)]'>
          {searchTerm && searchTerm.length > 0
            ? `Found ${filteredLevels.length} topics`
            : `Total ${filteredLevels.length} topics`}
        </Badge>
      </div>
      <div
        id='level-section'
        ref={levelSectionRef}
        className='flex flex-wrap gap-8 w-full h-full px-10 justify-center content-start text-center pt-44 lg:pt-48 pb-16 overflow-x-hidden overflow-y-scroll scrollbar-hide'
        onScroll={onScrollChange}
      >
        <LevelCard />
        {isFetchingLevels ? (
          <Skeleton numberOfRows={6} />
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
