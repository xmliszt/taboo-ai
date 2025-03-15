'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isDesktop } from 'react-device-detect';
import { ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortType } from '@/lib/utils/levelUtils';

import { HallOfFameToggle } from './hall-of-fame-toggle';
import { cn } from '@/lib/utils';

type SortItem = {
  value: SortType;
  label: string;
};

const sorters: SortItem[] = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'create-old', label: 'Oldest First' },
  { value: 'create-new', label: 'Newest First' },
  { value: 'most-popular', label: 'Most Popular First' },
  { value: 'least-popular', label: 'Least Popular First' },
  { value: 'easy-first', label: 'Easiest First' },
  { value: 'hard-first', label: 'Hardest First' },
];

export default function LevelsSearchBar({ topicNumber }: { topicNumber: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const timerRef = useRef<number | null>(null);

  // if user stops typing for 500ms, redirect to the new search term
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchTerm.length > 0) newSearchParams.set('search', searchTerm);
      else newSearchParams.delete('search');
      router.replace(`${pathname}?${newSearchParams}`);
    }, 500);
  }, [searchTerm]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className='relative bg-card'>
      <div
        className={`w-full overflow-hidden border-b-[1px] px-4 transition-all duration-300 lg:px-12`}
        style={{
          height: isCollapsed ? '0px' : '110px',
          borderColor: isCollapsed ? 'transparent' : 'hsl(var(--border))',
        }}
      >
        <div className='mt-4 flex flex-row items-center gap-4'>
          {/* only show dropdown sort selector only if on desktop*/}
          {isDesktop && (
            <Select
              defaultValue={searchParams.get('sort') || 'create-new'}
              onValueChange={(selectedSortType) => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set('sort', selectedSortType);
                router.replace(`${pathname}?${newSearchParams}`);
              }}
            >
              <SelectTrigger className='max-w-[250px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]'>
                <SelectGroup>
                  <SelectLabel>Sort Topics</SelectLabel>
                  {sorters.map((sorter) => (
                    <SelectItem key={sorter.value} value={sorter.value}>
                      {sorter.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Input
            className='flex w-full flex-row items-center gap-4 !text-sm'
            placeholder='Search by name/author'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='mt-2 flex flex-row items-center justify-between'>
          <Badge
            variant='outline'
            className='h-full rounded-sm font-normal'
          >{`${topicNumber} topics`}</Badge>
          {/* Hall-of-fame toggle */}
          <HallOfFameToggle />
        </div>
      </div>

      <motion.button
        className={cn(
          'absolute bottom-0 left-1/2 z-10 flex w-14 origin-bottom -translate-x-1/2 items-center bg-muted p-1.5',
          'transition-[transform_background]',
          isCollapsed ? 'translate-y-[calc(100%-1px)] rounded-b-sm' : 'translate-y-0 rounded-t-sm',
          isCollapsed && 'opacity-30 hover:opacity-70'
        )}
        onClick={toggleCollapse}
      >
        <motion.div
          className='gap-x-0.5 text-[10px] text-muted-foreground'
          initial={{ rotate: 0 }}
          animate={{ rotate: isCollapsed ? 180 : 0 }}
        >
          <ChevronUp size={14} />
        </motion.div>
        <span className='text-[10px] text-muted-foreground'>{isCollapsed ? 'Show' : 'Hide'}</span>
      </motion.button>
    </div>
  );
}
