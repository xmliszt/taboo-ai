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
import { LevelCardBadge } from './level-card-badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { HoverPerspectiveContainer } from './common/hover-perspective-container';
import { SignInReminderProps } from './globals/sign-in-reminder-dialog';
import { StarRatingBar } from './star-rating-bar';
import { CircleIcon, BookIcon, UsersIcon } from 'lucide-react';

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
        <section className='flex flex-col gap-2'>
          {level?.words && (
            <LevelCardBadge prefixIcon={<BookIcon className='size-3' />}>
              {level.words.length} words
            </LevelCardBadge>
          )}
          {level?.popularity !== undefined && (
            <LevelCardBadge prefixIcon={<UsersIcon className='size-3' />}>
              {level.popularity} {level.popularity <= 1 ? 'attempt' : 'attempts'}
            </LevelCardBadge>
          )}
          {level?.difficulty && (
            <LevelCardBadge
              prefixIcon={<CircleIcon className='size-3' />}
              className={cn(
                level.difficulty === 1
                  ? 'text-green-500'
                  : level.difficulty === 2
                    ? 'text-amber-500'
                    : level.difficulty === 3
                      ? 'text-red-500'
                      : 'text-border'
              )}
            >
              {getDifficulty(level.difficulty, false)}
            </LevelCardBadge>
          )}
        </section>
      );
    } else {
      return (
        <section className='mt-1 text-left text-sm leading-tight text-muted-foreground'>
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
              <div className='text-yellow-400'>
                {pluralize('CHAMPION', level.top_scorer_names.length, false)}
              </div>
              <div className='line-clamp-3 text-xl font-extrabold'>
                {level.top_scorer_names.join(' & ')}
              </div>
            </div>
          )}
        </section>
      );
    } else {
      return (
        <section className='flex animate-pulse flex-col items-center gap-4'>
          <p className='text-left text-sm leading-tight text-muted-foreground'>
            This topic awaits its <span className='text-yellow-400'>champion</span>, and it could be
            you! This is your chance to claim the title of highest scorer!
          </p>
        </section>
      );
    }
  };

  return (
    <HoverPerspectiveContainer
      className={cn('group/level-card relative select-none', 'w-[240px]', 'h-[340px]')}
    >
      <Card
        title={level?.name ? DisplayUtils.getLevelName(level.name) : 'Generate for me'}
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
            ? '!shadow-[0px_0px_10px_1px_rgba(255,204,51,1)]'
            : '',
          'relative flex h-full w-full flex-col shadow-md transition-all ease-in-out group-hover/level-card:scale-[1.02]'
        )}
      >
        <CardHeader>
          <div
            className={cn(
              'text-md truncate rounded-lg bg-primary px-3 py-2 font-extrabold leading-tight text-primary-foreground shadow-md',
              'transition-transform ease-in-out',
              'group-hover/level-card:-translate-y-[32px] group-hover/level-card:scale-150'
            )}
          >
            {!isAIMode ? DisplayUtils.getLevelName(level.name) : 'Generate for me'}
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
            'unicorn-color absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card transition-transform ease-in-out after:blur-sm',
            'group-hover/level-card:scale-[1.02]'
          )}
        ></span>
      ) : level.is_new && !isHallOfFameOn ? (
        <span
          className={cn(
            'rotating-green-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card transition-transform ease-in-out after:blur-sm',
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
