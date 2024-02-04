import Link from 'next/link';

import { fetchAllLevelsAndAuthors } from '@/app/x/review-words/server/fetch-levels';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { LevelUtils } from '@/lib/utils/levelUtils';

export const dynamic = 'force-dynamic';

export default async function ReviewWordsPage() {
  const levels = await fetchAllLevelsAndAuthors();
  const sortedLevels = [...levels].sort(LevelUtils.getCompareFn('create-new'));
  return (
    <ScrollArea className='w-full justify-center gap-2'>
      {sortedLevels.map((level) => (
        <Link
          key={level.id}
          href={`/x/review-words/${level.id}`}
          className={cn(
            'px-2 py-1 text-secondary-foreground hover:bg-foreground hover:text-background',
            'flex items-center justify-between gap-4 border border-border text-sm underline'
          )}
        >
          <div className={'flex flex-col gap-1'}>
            <div className={'whitespace-nowrap'}>{level.name}</div>
            <div>
              <Badge
                className={cn('rounded-none', level.is_verified ? 'bg-green-700' : 'bg-yellow-700')}
              >
                {level.is_verified ? 'verified' : '[x] not verified'}
              </Badge>
              {level.is_new && <Badge className={'rounded-none bg-green-600'}>new</Badge>}
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
              <Badge className={'rounded-none'}>{level.words.length}w</Badge>
            </div>
          </div>
          <div>by {level.author?.nickname ?? level.author?.name ?? 'Unknown'}</div>
        </Link>
      ))}
    </ScrollArea>
  );
}
