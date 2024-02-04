'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isDesktop } from 'react-device-detect';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import type { SortType } from '@/lib/utils/levelUtils';

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

  const isRankingModeOn = searchParams.get('rank') === 'true';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

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

        <form
          className='flex w-full flex-row items-center gap-4 !text-sm'
          onSubmit={(e) => {
            e.preventDefault();
            const newSearchParams = new URLSearchParams(searchParams);
            if (searchTerm.length > 0) newSearchParams.set('search', searchTerm);
            else newSearchParams.delete('search');
            router.replace(`${pathname}?${newSearchParams}`);
          }}
        >
          <Input
            placeholder='Search by name/author. Enter to search.'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.length > 0 && (
            <Button className='animate-fade-in' type='submit'>
              Search
            </Button>
          )}
        </form>
      </div>
      <div className='mt-2 flex flex-row items-center justify-between'>
        <Badge className='shadow-[0_5px_10px_rgba(0,0,0,0.3)]'>
          {`Found ${topicNumber} topics`}
        </Badge>
        <div
          className={cn(
            'relative h-6 w-44 rounded-sm border border-border after:blur-lg',
            isRankingModeOn
              ? 'rotating-golden-gradient '
              : 'rotating-golden-border-trace bg-background',
            'transition-transform ease-in-out hover:scale-105 hover:cursor-pointer'
          )}
          onClick={() => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (isRankingModeOn) newSearchParams.delete('rank');
            else newSearchParams.set('rank', 'true');
            router.replace(`${pathname}?${newSearchParams}`);
          }}
        >
          <div
            className={cn(
              'absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-sm text-center text-xs',
              isRankingModeOn ? 'text-black' : 'bg-background text-secondary-foreground'
            )}
          >{`Let's get competitive! 🏆`}</div>
        </div>
      </div>
    </div>
  );
}
