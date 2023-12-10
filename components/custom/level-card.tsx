'use client';

import { useRouter } from 'next/navigation';
import { getDifficulty } from '../../lib/utilities';
import ILevel from '../../lib/types/level.type';
import { DisplayUtils } from '@/lib/utils/displayUtils';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { setPersistence } from '@/lib/persistence/persistence';
import { HASH } from '@/lib/hash';
import { useAuth } from '../auth-provider';
import { Lock, Medal, Trophy } from 'lucide-react';
import { StarRatingBar } from './star-rating-bar';
import { getOverallRating } from '@/lib/utils/gameUtils';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { LoginReminderProps } from './globals/login-reminder-dialog';
import { SubscriptionPlanType } from '@/lib/types/subscription-plan.type';

interface LevelCardProps {
  isShowingRank?: boolean;
  level?: ILevel;
  topScore?: number;
  topScorerEmail?: string;
  topScorerName?: string;
  allowedPlanType?: SubscriptionPlanType[];
}

export function LevelCard({
  isShowingRank,
  level,
  topScore,
  topScorerEmail,
  topScorerName,
  allowedPlanType,
}: LevelCardProps) {
  const { user, userPlan, status } = useAuth();
  const router = useRouter();
  const [pointHasDown, setPointHasDown] = useState(false);
  const isAIMode = !level;
  const isLocked =
    isAIMode &&
    (status !== 'authenticated' ||
      !allowedPlanType?.includes(userPlan?.type ?? 'free'));

  const goToLevel = () => {
    if (isLocked) {
      return EventManager.fireEvent(CustomEventKey.SUBSCRIPTION_LOCK_DIALOG);
    }
    if (level) {
      setPersistence(HASH.level, level);
      if (isShowingRank && status === 'unauthenticated') {
        EventManager.fireEvent<LoginReminderProps>(
          CustomEventKey.LOGIN_REMINDER,
          {
            title:
              'You are not logged in. Only logged in users can have their results saved and ranked.',
            redirectHref: `/level/${level.id}`,
            afterDialogClose: () => {
              router.push(`/level/${level.id}`);
            },
            cancelLabel: 'Play as Guest',
          }
        );
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
          {level?.isNew === true && (
            <Badge
              variant='outline'
              className='bg-secondary text-secondary-foreground border-yellow-500'
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
              className='bg-secondary text-secondary-foreground border-primary'
            >
              {level.words.length} words
            </Badge>
          )}
          {level?.popularity !== undefined && (
            <Badge
              variant='outline'
              className='bg-secondary text-secondary-foreground border-primary'
            >
              {level.popularity}{' '}
              {level.popularity <= 1 ? 'attempt' : 'attempts'}
            </Badge>
          )}
        </section>
      );
    } else {
      return (
        <section className='mt-2 leading-tight text-left'>
          Can&apos;t find the topic you are looking for? Try ask the AI to
          generate for you!
        </section>
      );
    }
  };

  const renderRankingContent = () => {
    if (topScore && topScorerEmail) {
      return (
        <section className='flex flex-col gap-4 items-center'>
          <Medal size={25} />
          <div className='flex flex-col gap-2 items-center'>
            <div>Best Score</div>
            <div className='font-extrabold text-2xl'>{topScore.toFixed(1)}</div>
            <StarRatingBar
              rating={getOverallRating(topScore, 6)}
              maxRating={6}
            />
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <div className='italic'>by Top Scorer</div>
            <div className='font-extrabold text-2xl'>
              {topScorerName ?? 'Anonymous'}
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section className='flex flex-col gap-4 items-center animate-pulse'>
          <Trophy size={25} />
          <p className='leading-tight text-left'>
            The top scorer for this topic awaits its champion, and it could be
            you! This is your chance to claim the title of highest scorer!
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
        isAIMode ? 'unicorn-color' : '',
        'relative w-full h-auto sm:w-[200px] sm:min-h-[300px] transition-all ease-in-out cursor-pointer shadow-md flex flex-col hover:scale-[1.02]'
      )}
    >
      {isLocked && (
        <div className='absolute z-10 bg-black bg-opacity-60 w-full h-full top-0 left-0 rounded-lg flex flex-col gap-2 justify-center items-center text-white leading-normal p-4'>
          <Lock size={50} color='#eeeeee' strokeWidth={1} />
          <div>You need a PRO subscription to access this content</div>
        </div>
      )}
      <CardHeader>
        <div className='text-md leading-tight font-extrabold rounded-lg p-2 shadow-md bg-primary text-primary-foreground'>
          {!isAIMode ? DisplayUtils.getLevelName(level.name) : 'AI Mode'}
        </div>
      </CardHeader>
      <CardContent className='relative'>
        {isShowingRank ? renderRankingContent() : renderCardContent()}
      </CardContent>
      <div className='flex-grow h-auto w-full'></div>
      {level?.author && (
        <CardFooter>
          <div className='w-full italic text-right leading-snug'>
            by <span className='font-extrabold'>{level.author}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
