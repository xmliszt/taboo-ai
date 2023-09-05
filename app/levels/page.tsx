'use client';

import React, { useState } from 'react';
import HotBadge from '@/components/HotBadge';
import LoadingMask from '@/components/custom/loading-mask';
import { LevelCard } from '@/components/LevelCard';
import { useLevels } from '@/lib/hooks/useLevels';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LevelsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();

  const clearSearch = () => {
    setSearchTerm('');
    setFilterKeyword('');
  };

  return (
    <section className='w-full h-full px-10'>
      <LoadingMask isLoading={isFetchingLevels} message='Fetching Levels...' />
      <div className='w-full fixed z-50 h-12 top-12 left-0 lg:top-16 px-2 lg:px-12 py-2'>
        <div className='flex flex-row gap-4 items-center'>
          <Input
            className='w-full shadow-[0_5px_20px_rgba(0,0,0,0.4)]'
            placeholder='Search by topic name or author...'
            value={searchTerm}
            type='text'
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilterKeyword(e.target.value);
            }}
          />
          {searchTerm.length > 0 && (
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
      <div className='flex flex-wrap gap-8 w-full h-full justify-center content-start text-center pt-36 lg:pt-44 pb-16 overflow-y-scroll scrollbar-hide'>
        <HotBadge>
          <LevelCard />
        </HotBadge>
        {filteredLevels.map((level, idx) => (
          <LevelCard key={idx} level={level} />
        ))}
      </div>
    </section>
  );
}
