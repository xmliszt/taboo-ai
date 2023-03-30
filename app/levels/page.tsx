'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import LoadingMask from '../(components)/LoadingMask';
import { getLevels } from '../../lib/services/frontend/levelService';
import ILevel from '../../types/level.interface';
import Badge from '../(components)/(Badges)/Badge';
import HotBadge from '../(components)/(Badges)/HotBadge';
import NewBadge from '../(components)/(Badges)/NewBadge';
import AuthorBadge from '../(components)/(Badges)/AuthorBadge';
import LevelButton from '../(components)/LevelButton';
import { getDifficulty } from '../../lib/utilities';

interface LevelsPageProps {}

export default function LevelsPage(props: LevelsPageProps) {
  const title = 'Choose A Topic';
  const [isMounted, setIsMounted] = useState(false);
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      const levels = await getLevels();
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
        return 'bg-yellow dark:bg-neon-yellow';
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

  useEffect(() => {
    !isMounted && setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [isMounted]);

  return (
    <section className='w-full h-full flex justify-around px-10 overflow-y-scroll scrollbar-hide'>
      <LoadingMask isLoading={isLoading} message='Fetching Levels...' />
      <h1
        data-testid='levels-heading-title'
        className='fixed top-0 z-50 h-20 text-center pt-4 dark:text-neon-blue pointer-events-none'
      >
        {title}
      </h1>
      <div className='w-full fixed z-20 h-12 top-12 lg:top-20 px-12 bg-black dark:bg-neon-black'>
        <input
          className='w-full'
          placeholder='Search for levels...'
          type='text'
          onChange={onSearchChange}
        />
      </div>
      <section className='flex-grow content-start grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-16 py-10 mt-20 lg:mt-36 text-center'>
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
                        customClass='!border-4 !border-yellow !dark:border-neon-yellow'
                      />
                    </AuthorBadge>
                  ) : (
                    <LevelButton
                      level={level}
                      customClass='!border-4 !border-yellow !dark:border-neon-yellow'
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
      </section>
    </section>
  );
}
