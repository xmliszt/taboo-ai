'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearLevel } from '../(caching)/cache';
import BackButton from '../(components)/BackButton';
import LoadingMask from '../(components)/Loading';
import { getLevels } from '../(services)/levelService';
import ILevel from './(models)/level.interface';
import Badge from './(components)/Badge';
import LevelButton from './(components)/LevelButton';

export default function LevelsPage() {
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
    clearLevel();
  }, []);

  return (
    <>
      <LoadingMask isLoading={isLoading} message='Fetching Levels...' />
      <BackButton href='/' />
      <h1
        data-testid='levels-heading-title'
        className='fixed w-full top-0 z-20 bg-black dark:bg-neon-black text-center drop-shadow-lg text-2xl lg:text-6xl py-4 dark:text-neon-blue'
      >
        {title}
      </h1>
      <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 h-auto gap-8 lg:gap-10 p-10 mt-16 lg:mt-24 text-center'>
        <LevelButton isAI={true} />
        {levels.map((level) => (
          <Badge
            key={level.id}
            label={getDifficulty(level.difficulty)}
            customClass={getDifficultyColor(level.difficulty)}
          >
            <LevelButton level={level} />
          </Badge>
        ))}
      </section>
    </>
  );
}
