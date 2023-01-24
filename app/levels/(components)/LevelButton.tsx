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
      } h-full w-full text-xs lg:text-2xl px-8 py-4 lg:px-10 lg:py-4 break-words`}
      onClick={() => goToLevel()}
    >
      {isAI ? 'AI Mode' : level?.name}
    </button>
  );
}
