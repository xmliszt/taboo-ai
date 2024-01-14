'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Medal, Trophy } from 'lucide-react';

import { FetchAllLevelsAndRanksReturnTypeSingle } from '@/app/levels/server/fetch-levels';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';
import { Database } from '@/lib/supabase/extension/types';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { DisplayUtils } from '@/lib/utils/displayUtils';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { useAuth } from '../auth-provider';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { LoginReminderProps } from './globals/login-reminder-dialog';
import { StarRatingBar } from './star-rating-bar';

interface LevelCardProps {
  level?: FetchAllLevelsAndRanksReturnTypeSingle;
  isShowingRank?: boolean;
  allowedPlanType?: Database['public']['Enums']['customer_plan_type'][];
}

export function LevelCard({ isShowingRank, level, allowedPlanType }: LevelCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [pointHasDown, setPointHasDown] = useState(false);
  const isAIMode = !level;
  const isLocked =
    isAIMode &&
    (!user || !allowedPlanType?.includes(user.subscription?.customer_plan_type ?? 'free'));

  const goToLevel = () => {
    if (isLocked) {
      return EventManager.fireEvent(CustomEventKey.SUBSCRIPTION_LOCK_DIALOG);
    }
    if (level) {
      setPersistence(HASH.level, level);
      if (isShowingRank && !user) {
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
    if (!isAIMode) {
      return (
        <section className='flex flex-wrap gap-2'>
          {level?.is_new === true && (
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
    if (level?.best_score) {
      return (
        <section className='flex flex-col items-center gap-4'>
          <Medal size={25} />
          <div className='flex flex-col items-center gap-2'>
            <div>Best Score</div>
            <div className='text-2xl font-extrabold'>{level.best_score.toFixed(1)}</div>
            <StarRatingBar rating={getOverallRating(level.best_score, 6)} maxRating={6} />
          </div>
          {level?.top_scorer_names && (
            <div className='flex flex-col items-center gap-2'>
              {level.top_scorer_names.length > 1 ? (
                <div className='italic'>by Top Scorers</div>
              ) : (
                <div className='italic'>by Top Scorer</div>
              )}
              <div className='text-2xl font-extrabold'>{level.top_scorer_names.join(' & ')}</div>
            </div>
          )}
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
        isShowingRank && user && level?.top_scorer_ids?.includes(user.id)
          ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]'
          : '',
        isAIMode ? 'unicorn-color' : '',
        'relative flex h-auto w-full cursor-pointer flex-col shadow-md transition-all ease-in-out hover:scale-[1.02] sm:min-h-[300px] sm:w-[200px]'
      )}
    >
      {isLocked && (
        <div className='absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-black bg-opacity-60 p-4 leading-normal text-white'>
          <Lock size={50} color='#eeeeee' strokeWidth={1} />
          <div>You need a PRO subscription to access this content</div>
        </div>
      )}
      <CardHeader>
        <div className='text-md rounded-lg bg-primary p-2 font-extrabold leading-tight text-primary-foreground shadow-md'>
          {!isAIMode ? DisplayUtils.getLevelName(level.name) : 'AI Mode'}
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
  );
}
