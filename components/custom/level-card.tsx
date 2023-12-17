'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Medal, Trophy } from 'lucide-react';

import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';
import { cn } from '@/lib/utils';
import { DisplayUtils } from '@/lib/utils/displayUtils';
import { getOverallRating } from '@/lib/utils/gameUtils';

import ILevel from '../../lib/types/level.type';
import { getDifficulty } from '../../lib/utilities';
import { useAuth } from '../auth-provider';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { LoginReminderProps } from './login-reminder-dialog';
import { StarRatingBar } from './star-rating-bar';

interface LevelCardProps {
  isShowingRank?: boolean;
  level?: ILevel;
  topScore?: number;
  topScorerEmail?: string;
  topScorerName?: string;
}

export function LevelCard({
  isShowingRank,
  level,
  topScore,
  topScorerEmail,
  topScorerName,
}: LevelCardProps) {
  const { user, status } = useAuth();
  const router = useRouter();
  const [pointHasDown, setPointHasDown] = useState(false);

  const goToLevel = () => {
    if (level) {
      setPersistence(HASH.level, level);
      if (isShowingRank && status === 'unauthenticated') {
        EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {
          title:
            'You are not logged in. Only logged in users can have their results saved and ranked.',
          redirectHref: `/level/${level.id}`,
          afterDialogClose: () => {
            router.push(`/level/${level.id}`);
          },
          cancelLabel: 'Play as Guest',
        });
      } else {
        router.push(`/level/${level.id}`);
      }
    } else {
      return router.push('/ai');
    }
  };

  const renderCardContent = () => {
    if (level) {
      return (
        <section className='flex flex-wrap gap-2'>
          {level?.isNew === true && (
            <Badge
              variant='outline'
              className='border-yellow-500 bg-secondary text-secondary-foreground'
            >
              New Level
            </Badge>
          )}
          {level?.difficulty && (
            <Badge
              variant='outline'
              className={cn(
                'bg-secondary text-secondary-foreground',
                level.difficulty === 1
                  ? 'border-green-500'
                  : level.difficulty === 2
                    ? 'border-amber-500'
                    : level.difficulty === 3
                      ? 'border-red-500'
                      : 'border-border'
              )}
            >
              Difficulty: {getDifficulty(level.difficulty, false)}
            </Badge>
          )}
          {level?.words && (
            <Badge
              variant='outline'
              className='border-primary bg-secondary text-secondary-foreground'
            >
              {level.words.length} words
            </Badge>
          )}
          {level?.popularity !== undefined && (
            <Badge
              variant='outline'
              className='border-primary bg-secondary text-secondary-foreground'
            >
              {level.popularity} {level.popularity <= 1 ? 'attempt' : 'attempts'}
            </Badge>
          )}
        </section>
      );
    } else {
      return (
        <section className='mt-2 text-left leading-tight'>
          Can&apos;t find the topic you are looking for? Try ask the AI to generate for you!
        </section>
      );
    }
  };

  const renderRankingContent = () => {
    if (topScore && topScorerEmail) {
      return (
        <section className='flex flex-col items-center gap-4'>
          <Medal size={25} />
          <div className='flex flex-col items-center gap-2'>
            <div>Best Score</div>
            <div className='text-2xl font-extrabold'>{topScore.toFixed(1)}</div>
            <StarRatingBar rating={getOverallRating(topScore, 6)} maxRating={6} />
          </div>
          <div className='flex flex-col items-center gap-2'>
            <div className='italic'>by Top Scorer</div>
            <div className='text-2xl font-extrabold'>{topScorerName ?? 'Anonymous'}</div>
          </div>
        </section>
      );
    } else {
      return (
        <section className='flex animate-pulse flex-col items-center gap-4'>
          <Trophy size={25} />
          <p className='text-left leading-tight'>
            The top scorer for this topic awaits its champion, and it could be you! This is your
            chance to claim the title of highest scorer!
          </p>
        </section>
      );
    }
  };

  return (
    <Card
      onPointerDown={() => {
        setPointHasDown(true);
      }}
      onClick={() => {
        if (pointHasDown) {
          goToLevel();
          setPointHasDown(false);
        }
      }}
      className={cn(
        isShowingRank && user && user?.email === topScorerEmail
          ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]'
          : '',
        level ? '' : 'unicorn-color',
        'flex h-auto w-full cursor-pointer flex-col shadow-md transition-all ease-in-out hover:scale-[1.02] sm:min-h-[300px] sm:w-[200px]'
      )}
    >
      <CardHeader>
        <div className='text-md rounded-lg bg-primary p-2 font-extrabold leading-tight text-primary-foreground shadow-md'>
          {level ? DisplayUtils.getLevelName(level.name) : 'AI Mode'}
        </div>
      </CardHeader>
      <CardContent className='relative'>
        {isShowingRank ? renderRankingContent() : renderCardContent()}
      </CardContent>
      <div className='h-auto w-full flex-grow'></div>
      {level?.author && (
        <CardFooter>
          <div className='w-full text-right italic leading-snug'>
            by <span className='font-extrabold'>{level.author}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
