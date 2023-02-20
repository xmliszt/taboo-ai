'use client';

import React, { useEffect, useState } from 'react';
import { clearLevel } from '../(caching)/cache';
import BackButton from '../(components)/BackButton';
import LoadingMask from '../(components)/Loading';
import { getLevels } from '../(services)/levelService';
import ILevel from './(models)/level.interface';
import Badge from './(components)/Badge';
import HotBadge from './(components)/HotBadge';
import NewBadge from './(components)/NewBadge';
import AuthorBadge from './(components)/AuthorBadge';
import LevelButton from './(components)/LevelButton';

interface LevelsPageProps {}

export default function LevelsPage(props: LevelsPageProps) {
  const title = 'Choose A Category';
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLevels = async () => {
    setIsLoading(true);
    const levels = await getLevels();
    setIsLoading(false);
    setLevels(levels);
  };

  const getDifficulty = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Easy (1)';
      case 2:
        return 'Medium (2)';
      case 3:
        return 'Hard (3)';
      default:
        return 'Unknown (?)';
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

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <>
      <LoadingMask isLoading={isLoading} message='Fetching Levels...' />
      <BackButton href='/' />
      <h1
        data-testid='levels-heading-title'
        className='fixed w-full top-0 z-20 h-20 gradient-down dark:gradient-down-dark-black text-center drop-shadow-lg py-4 dark:text-neon-blue pointer-events-none'
      >
        {title}
      </h1>
      <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 h-auto gap-10 lg:gap-16 p-10 mt-16 lg:mt-24 text-center'>
        <HotBadge>
          <LevelButton isAI={true} />
        </HotBadge>
        {levels.map((level) =>
          level.new ? (
            <Badge
              key={level.name}
              label={getDifficulty(level.difficulty)}
              customClass={getDifficultyColor(level.difficulty)}
            >
              <NewBadge>
                {level.author !== undefined ? (
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
              <LevelButton level={level} />
            </Badge>
          )
        )}
      </section>
    </>
  );
}
