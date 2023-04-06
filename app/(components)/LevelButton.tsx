'use client';

import { useRouter } from 'next/navigation';
import ILevel from '../../types/level.interface';
import { cacheLevel } from '../../lib/cache';

export default function LevelButton({
  level = undefined,
  isAI = false,
  customClass = '',
}: {
  level?: ILevel;
  isAI?: boolean;
  customClass?: string;
}) {
  const router = useRouter();

  const goToLevel = () => {
    if (isAI) {
      return router.push('/ai');
    }
    if (level) {
      cacheLevel(level);
      return router.push(`/level`);
    }
  };

  return (
    <button
      aria-label={`level button: level ${level?.name ?? 'ai'}`}
      data-testid={`level-link-${level?.name ?? 'ai'}`}
      data-style={isAI && 'none'}
      className={`w-full ${customClass} h-12 lg:h-24`}
      onClick={() => goToLevel()}
    >
      <div
        className={`text-xs lg:text-2xl px-2 py-2 lg:px-10 lg:py-4 break-words flex justify-center items-center ${
          isAI && 'color-gradient-animated-background'
        } `}
      >
        {isAI ? 'AI Mode' : level?.name}
      </div>
    </button>
  );
}
