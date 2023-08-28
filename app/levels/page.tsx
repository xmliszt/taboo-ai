'use client';

import React, { useState } from 'react';
import HotBadge from '../../components/Badges/HotBadge';
import LoadingMask from '../../components/LoadingMask';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { LevelCard } from '../../components/LevelCard';
import { useLevels } from '@/lib/hooks/useLevels';

export default function LevelsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { filteredLevels, setFilterKeyword, isLoading } = useLevels();

  const clearSearch = () => {
    setSearchTerm('');
    setFilterKeyword('');
  };

  return (
    <section className='w-full h-full px-10'>
      <LoadingMask isLoading={isLoading} message='Fetching Levels...' />
      <div className='w-full fixed z-20 h-12 top-12 left-0 lg:top-20 px-12 py-2'>
        <InputGroup size='md'>
          <Input
            className='w-full shadow-[0_5px_20px_rgba(0,0,0,0.4)] bg-white text-black border-gray'
            placeholder='Search by topic name or author...'
            value={searchTerm}
            type='text'
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilterKeyword(e.target.value);
            }}
          />
          <InputRightElement
            width='60px'
            height='40px'
            hidden={(searchTerm?.length ?? 0) <= 0}
          >
            <IconButton
              data-style='none'
              variant='unstyled'
              className='text-white hover:opacity-70 flex justify-center items-center'
              aria-label='clear text field'
              size='sm'
              onClick={clearSearch}
              icon={<FiX />}
            />
          </InputRightElement>
        </InputGroup>
        {searchTerm && searchTerm.length > 0 && (
          <Tag className='mt-3 shadow-[0_5px_20px_rgba(0,0,0,0.7)]'>
            Found {filteredLevels.length} topics
          </Tag>
        )}
      </div>
      <Flex
        wrap='wrap'
        gap={8}
        className='w-full h-full justify-center content-start text-center pt-36 lg:pt-44 pb-16 overflow-y-scroll scrollbar-hide'
      >
        <HotBadge>
          <LevelCard />
        </HotBadge>
        {filteredLevels.map((level, idx) => (
          <LevelCard key={idx} level={level} />
        ))}
      </Flex>
    </section>
  );
}
