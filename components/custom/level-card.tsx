'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import pluralize from 'pluralize';

import { FetchAllLevelsAndRanksReturnTypeSingle } from '@/app/levels/server/fetch-levels';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { DisplayUtils } from '@/lib/utils/displayUtils';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { useAuth } from '../auth-provider';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { HoverPerspectiveContainer } from './common/hover-perspective-container';
import { SignInReminderProps } from './globals/sign-in-reminder-dialog';
import { StarRatingBar } from './star-rating-bar';

type LevelCardProps = {
  level?: FetchAllLevelsAndRanksReturnTypeSingle;
  isShowingRank?: boolean;
  beforeGoToLevel?: () => void;
};

export function LevelCard({ isShowingRank, level, beforeGoToLevel }: LevelCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [pointHasDown, setPointHasDown] = useState(false);
  const isAIMode = !level;
  const isHallOfFameOn = searchParams.has('rank');

  const goToLevel = () => {
    beforeGoToLevel && beforeGoToLevel();
    if (level) {
      setPersistence(HASH.level, level);
      // If the user is not logged in, show the sign in reminder dialog
      if (!user) {
        EventManager.fireEvent<SignInReminderProps>(CustomEventKey.SIGN_IN_REMINDER, {
          title: 'Please sign in to play this level.',
          redirectHref: `/level/${level.id}`,
        });
      } else {
        router.push(`/level/${level.id}`);
      }
    } else {
      return router.push('/ai');
    }
  };

  const renderCardContent = () => {
    if (!isAIMode) {
      return (
        <section className='flex flex-wrap gap-2'>
          {level?.is_new === true && (
            <Badge
              variant='outline'
              className='border-[#42eca6] bg-secondary text-secondary-foreground'
            >
              New level
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
          {`Can't find the topic you are looking for? Try ask the AI to generate for you!`}
        </section>
      );
    }
  };

  const renderRankingContent = () => {
    if (level?.best_score) {
      return (
        <section className='flex flex-col items-center gap-2'>
          <StarRatingBar
            className='transition-transform ease-out group-hover/level-card:-translate-y-1/2 group-hover/level-card:scale-125'
            rating={getOverallRating(level.best_score, 6)}
            maxRating={6}
          />
          <div className='flex flex-col items-center gap-2'>
            <div className='text-2xl font-extrabold'>
              <span className='text-base font-normal'>Best:</span> {level.best_score.toFixed(2)}
            </div>
          </div>
          {level?.top_scorer_names && (
            <div className='flex flex-col items-center gap-2'>
              <div className='font-bold text-yellow-400'>
                {pluralize('CHAMPION', level.top_scorer_names.length, false)}
              </div>
              <div className='text-2xl font-extrabold'>{level.top_scorer_names.join(' & ')}</div>
            </div>
          )}
        </section>
      );
    } else {
      return (
        <section className='flex animate-pulse flex-col items-center gap-4'>
          <p className='text-center leading-tight'>
            This topic awaits its <b className='text-yellow-400'>champion</b>, and it could be you!
            This is your chance to claim the title of highest scorer!
          </p>
        </section>
      );
    }
  };

  return (
    <HoverPerspectiveContainer className={'group/level-card relative cursor-pointer'}>
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
          'z-10',
          isShowingRank && user && level?.top_scorer_ids?.includes(user.id)
            ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]'
            : '',
          'relative flex cursor-pointer flex-col shadow-md transition-all ease-in-out group-hover/level-card:scale-[1.02]  ',
          'w-full xs:w-[200px]',
          'h-full xs:min-h-[300px]'
        )}
      >
        <CardHeader>
          <div
            className={cn(
              'text-md rounded-lg bg-primary p-2 font-extrabold leading-tight text-primary-foreground shadow-md transition-transform ease-in-out',
              'group-hover/level-card:-translate-y-1/2 group-hover/level-card:scale-150'
            )}
          >
            {!isAIMode ? DisplayUtils.getLevelName(level.name) : 'AI Generated Topics'}
          </div>
        </CardHeader>
        <CardContent className='relative'>
          {isShowingRank ? renderRankingContent() : renderCardContent()}
        </CardContent>
        <div className='h-auto w-full flex-grow'></div>
        {level?.created_by && (
          <CardFooter>
            <div className='w-full text-right italic leading-snug'>
              by <span className='font-extrabold'>{level.created_by}</span>
            </div>
          </CardFooter>
        )}
      </Card>
      {isAIMode ? (
        <span
          className={cn(
            'unicorn-color absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card transition-transform ease-in-out after:blur-lg',
            'group-hover/level-card:scale-[1.02]'
          )}
        ></span>
      ) : level.is_new && !isHallOfFameOn ? (
        <span
          className={cn(
            'rotating-green-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card transition-transform ease-in-out after:blur-[4px]',
            'group-hover/level-card:scale-[1.02]'
          )}
        ></span>
      ) : null}
      <span
        className={cn(
          'rotating-mono-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card opacity-0 transition-[transform_opacity_0.3s_ease-in-out] after:blur-sm group-hover/level-card:scale-[1.02] group-hover/level-card:opacity-70'
        )}
      ></span>
    </HoverPerspectiveContainer>
  );
}
