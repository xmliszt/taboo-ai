'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isDesktop } from 'react-device-detect';

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

  return (
    <div>
      <div className='flex flex-row items-center gap-4'>
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
        <Badge className='h-full shadow-lg'>{`${topicNumber} topics`}</Badge>
        {/* Hall-of-fame toggle */}
        <HallOfFameToggle />
      </div>
    </div>
  );
}
