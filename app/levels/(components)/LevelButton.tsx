'use client';

import { useRouter } from 'next/navigation';
import ILevel from '../(models)/level.interface';
import { cacheLevel } from '../../(caching)/cache';

export default function LevelButton({
  level = undefined,
  isAI = false,
}: {
  level?: ILevel;
  isAI?: boolean;
}) {
  const router = useRouter();

  const goToLevel = () => {
    if (isAI) {
      return router.push('/ai');
    }
    if (level) {
      cacheLevel(level);
      return router.push(`/level/${level.id}`);
    }
  };

  return (
    <button
      data-testid={`level-link-${level?.id ?? 'ai'}`}
      className={`${
        isAI && 'unicorn-color'
      } w-full h-full text-xs lg:text-2xl px-2 lg:px-10 lg:py-5`}
      onClick={() => goToLevel()}
    >
      {isAI ? 'AI Mode' : level?.name}
    </button>
  );
}
