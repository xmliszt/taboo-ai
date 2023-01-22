'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cacheLevel, clearLevel } from '../(caching)/cache';
import BackButton from '../(components)/BackButton';
import LoadingMask from '../(components)/Loading';
import { getLevels } from '../(services)/levelService';
import ILevel from './(models)/level.interface';
import Badge from './(components)/Badge';

export default function LevelsPage() {
  const title = 'Choose A Category';
  const router = useRouter();
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLevels = async () => {
    setIsLoading(true);
    const levels = await getLevels();
    setIsLoading(false);
    setLevels(levels);
  };

  const goToLevel = (levelID: string) => {
    cacheLevel(levels.filter((level) => level.id === levelID)[0]);
    router.push(`/level/${levelID}`);
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
        <Link
          key='ai-mode'
          id='ai-mode'
          className='relative drop-shadow-lg shadow-lg w-full h-full flex items-center justify-center unicorn-color text-center border-2 lg:border-8 border-white dark:border-neon-green text-lg bg-white dark:bg-neon-gray dark:text-neon-white text-black hover:text-white hover:dark:text-neon-black hover:bg-black hover:dark:bg-neon-green hover:border-gray hover:dark:border-neon-gray transition-colors rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-3xl overflow-hidden'
          href={`/ai`}
        >
          AI Mode
        </Link>
        {levels.map((level) => (
          <Badge
            key={level.id}
            label={getDifficulty(level.difficulty)}
            customClass={getDifficultyColor(level.difficulty)}
          >
            <button
              data-testid={`level-link-${level.id}`}
              className='drop-shadow-lg shadow-lg transition-colors w-full h-full border-2 lg:border-8 border-white text-md bg-white dark:bg-neon-gray text-black hover:text-white hover:bg-black hover:border-gray rounded px-5 lg:text-2xl lg:px-10 lg:py-5 lg:rounded-3xl overflow-hidden hover:dark:text-neon-black hover:dark:bg-neon-green hover:dark:border-neon-gray dark:text-neon-white dark:border-neon-green'
              onClick={() => goToLevel(level.id)}
            >
              {level.name}
            </button>
          </Badge>
        ))}
      </section>
    </>
  );
}
