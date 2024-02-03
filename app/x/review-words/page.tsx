import Link from 'next/link';

import { fetchAllLevelsAndAuthors } from '@/app/x/review-words/server/fetch-levels';
import { Badge } from '@/components/ui/badge';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { LevelUtils } from '@/lib/utils/levelUtils';

export const dynamic = 'force-dynamic';

export default async function ReviewWordsPage() {
  const levels = await fetchAllLevelsAndAuthors();
  const sortedLevels = [...levels].sort(LevelUtils.getCompareFn('create-new'));
  return (
    <div className='w-full justify-center gap-2 overflow-y-auto'>
      {sortedLevels.map((level) => (
        <Link
          key={level.id}
          href={`/x/review-words/${level.id}`}
          className={cn(
            'bg-secondary px-2 py-1 text-secondary-foreground hover:bg-foreground hover:text-background',
            'flex items-center justify-between gap-4 underline'
          )}
        >
          <div className={'flex flex-row items-center gap-2'}>
            <div>{level.name}</div>
            <Badge
              className={cn(
                'rounded-none',
                level.is_verified ? 'bg-green-700 text-white' : 'bg-yellow-700 text-white'
              )}
            >
              {level.is_verified ? 'verified' : '[x] not verified'}
            </Badge>
            {level.is_new && <Badge className={'rounded-none bg-green-700 text-white'}>new</Badge>}
            <Badge
              className={cn(
                'rounded-none',
                level.difficulty === 1
                  ? 'bg-green-500'
                  : level.difficulty === 2
                    ? 'bg-yellow-500'
                    : level.difficulty === 3
                      ? 'bg-red-500'
                      : 'bg-gray-500'
              )}
            >
              {getDifficulty(level.difficulty, false)}
            </Badge>
            <Badge className={'rounded-none bg-primary text-white'}>{level.words.length}w</Badge>
          </div>
          <div>by {level.author?.nickname ?? level.author?.name ?? 'Unknown'}</div>
        </Link>
      ))}
    </div>
  );
}
