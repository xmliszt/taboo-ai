'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { isDesktop } from 'react-device-detect';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
      <div className='mt-4 flex flex-row items-center justify-between'>
        <Badge className='shadow-[0_5px_10px_rgba(0,0,0,0.3)]'>
          {`Found ${topicNumber} topics`}
        </Badge>
        <div className='flex flex-row items-center gap-2'>
          <Switch
            id='ranking-mode-switch'
            className={cn(isRankingModeOn ? 'shadow-[0_5px_10px_rgba(0,0,0,0.3)]' : 'shadow-none')}
            checked={isRankingModeOn}
            onCheckedChange={(checked) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (checked) newSearchParams.set('rank', checked.toString());
              else newSearchParams.delete('rank');
              router.replace(`${pathname}?${newSearchParams}`);
            }}
          />
          <Label
            htmlFor='ranking-mode-switch'
            className={cn(
              isRankingModeOn ? 'font-bold text-primary' : 'font-light text-muted-foreground'
            )}
          >
            Ranking Mode
          </Label>
        </div>
      </div>
    </div>
  );
}
