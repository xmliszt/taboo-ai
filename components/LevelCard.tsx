'use client';

import { Card, CardBody, CardFooter, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { cacheLevel } from '../lib/cache';
import { getDifficulty } from '../lib/utilities';
import ILevel from '../lib/types/level.interface';
import { DisplayUtils } from '@/lib/utils/displayUtils';

interface LevelCardProps {
  level?: ILevel;
}

export function LevelCard({ level }: LevelCardProps) {
  const router = useRouter();
  const goToLevel = () => {
    if (level) {
      cacheLevel(level);
      return router.push(`/level`);
    } else {
      return router.push('/ai');
    }
  };

  const getDifficultyColor = (n: number): string => {
    switch (n) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
        return '';
    }
  };

  return (
    <Card
      onClick={goToLevel}
      className={`w-[200px] h-[250px] transition-all hover:scale-105 ease-in-out cursor-pointer aspect-square rounded-xl shadow-lg shadow-lg bg-white ${
        level ? '' : 'unicorn-color'
      }`}
    >
      <CardBody p='2' className='relative'>
        <div
          className={`text-xl leading-tight font-extrabold rounded-lg p-2 shadow-md ${
            level ? 'bg-neon-white text-black' : 'bg-black-darker text-white'
          }`}
        >
          {level ? DisplayUtils.getLevelName(level.name) : 'AI Mode'}
        </div>
        {level ? (
          <section className='flex flex-wrap gap-2 mt-4'>
            {level?.isNew === true && (
              <Tag variant='solid' colorScheme='orange'>
                New Level
              </Tag>
            )}
            {level?.difficulty && (
              <Tag
                variant='solid'
                colorScheme={getDifficultyColor(level.difficulty)}
              >
                Difficulty: {getDifficulty(level.difficulty, false)}
              </Tag>
            )}
            {level?.words && (
              <Tag variant='solid'>{level.words.length} words</Tag>
            )}
          </section>
        ) : (
          <section className='mt-4 p-2 leading-tight text-left font-bold'>
            Can&apos;t find the topic you are looking for? Try ask the AI to
            generate for you!
          </section>
        )}
      </CardBody>
      {level?.author && (
        <CardFooter>
          <div className='w-full italic text-right'>
            by <span className='font-extrabold'>{level.author}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
