'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { getLevels } from '../../lib/services/frontend/levelService';
import ILevel from '../../types/level.interface';
import Badge from '../../components/Badges/Badge';
import HotBadge from '../../components/Badges/HotBadge';
import NewBadge from '../../components/Badges/NewBadge';
import AuthorBadge from '../../components/Badges/AuthorBadge';
import LevelButton from '../../components/LevelButton';
import { getDifficulty } from '../../lib/utilities';
import LoadingMask from '../../components/LoadingMask';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

interface LevelsPageProps {}

export default function LevelsPage(props: LevelsPageProps) {
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      let levels = await getLevels();
      levels = levels.filter((l) => l.isVerified);
      setLevels(levels);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'bg-green dark:bg-neon-green';
      case 2:
        return 'bg-yellow dark:bg-neon-yellow !text-black';
      case 3:
        return 'bg-red dark:bg-neon-red';
      default:
        return 'bg-black dark:bg-neon-black';
    }
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <section className='w-full h-full flex justify-around px-10 overflow-y-scroll scrollbar-hide'>
      <LoadingMask isLoading={isLoading} message='Fetching Levels...' />
      <div className='w-full fixed z-20 h-12 top-12 lg:top-20 px-12 py-2'>
        <InputGroup size='md'>
          <Input
            className='w-full drop-shadow-[0_5px_20px_rgba(0,0,0,0.7)] bg-white text-black border-gray'
            placeholder='Search for levels...'
            value={searchTerm}
            type='text'
            onChange={onSearchChange}
          />
          <InputRightElement width='60px' height='40px'>
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
      </div>
      <section className='flex-grow content-start grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 px-4 gap-10 lg:gap-16 pt-32 lg:pt-52 lg:pb-16 text-center'>
        <HotBadge location='TOP-LEFT'>
          <LevelButton isAI={true} />
        </HotBadge>
        {levels
          .filter((level) =>
            level.name
              .toLowerCase()
              .includes(searchTerm ? searchTerm.toLowerCase() : '')
          )
          .map((level) =>
            level.new ? (
              <Badge
                key={level.name}
                label={getDifficulty(level.difficulty)}
                customClass={getDifficultyColor(level.difficulty)}
              >
                <NewBadge>
                  {level.author ? (
                    <AuthorBadge label={level.author}>
                      <LevelButton
                        level={level}
                        customClass='!border-4 !border-yellow'
                      />
                    </AuthorBadge>
                  ) : (
                    <LevelButton
                      level={level}
                      customClass='!border-4 !border-yellow'
                    />
                  )}
                </NewBadge>
              </Badge>
            ) : (
              <Badge
                key={level.name}
                label={getDifficulty(level.difficulty)}
                customClass={getDifficultyColor(level.difficulty)}
              >
                {level.author ? (
                  <AuthorBadge label={level.author}>
                    <LevelButton level={level} />
                  </AuthorBadge>
                ) : (
                  <LevelButton level={level} />
                )}
              </Badge>
            )
          )}
        <div className='h-4 w-full'></div>
      </section>
    </section>
  );
}
