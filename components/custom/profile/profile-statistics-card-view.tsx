'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import { AsyncReturnType } from 'type-fest';

import { useAuth } from '@/components/auth-provider';
import IconButton from '@/components/ui/icon-button';
import { getAllGamesCompletedByUser } from '@/lib/services/gameService';
import {
  getBestPerformingLevelSummary,
  getLevelsCompletedByUser,
  getMostFreqPlayedLevelsSummary,
} from '@/lib/services/levelService';
import { cn } from '@/lib/utils';

import { Skeleton } from '../skeleton';
import ProfileStatisticsSimpleCardView from './profile-statistics-simple-card';

export default function ProfileStatisticsCardView() {
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bestPerformingTopic, setBestPerformingTopic] =
    useState<AsyncReturnType<typeof getBestPerformingLevelSummary>[number]>();
  const [mostFreqPlayedTopics, setMostFreqPlayedTopics] =
    useState<AsyncReturnType<typeof getMostFreqPlayedLevelsSummary>>();
  const [allPlayedLevels, setAllPlayedLevels] =
    useState<AsyncReturnType<typeof getLevelsCompletedByUser>>();
  const [allPlayedGames, setAllPlayedGames] =
    useState<AsyncReturnType<typeof getAllGamesCompletedByUser>>();
  const router = useRouter();

  useEffect(() => {
    currentUser && void getUserStats(currentUser.id);
  }, [currentUser]);

  const getUserStats = async (uid: string) => {
    try {
      setIsLoading(true);
      const [bestPerformingLevels, mostFreqPlayedLevels, allLevelsCompleted, allGamesCompleted] =
        await Promise.all([
          getBestPerformingLevelSummary(uid),
          getMostFreqPlayedLevelsSummary(uid),
          getLevelsCompletedByUser(uid),
          getAllGamesCompletedByUser(uid),
        ]);
      setBestPerformingTopic(bestPerformingLevels[0]);
      setMostFreqPlayedTopics(mostFreqPlayedLevels);
      setAllPlayedLevels(allLevelsCompleted);
      setAllPlayedGames(allGamesCompleted);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Game Statistics</h2>
        <IconButton
          asChild
          tooltip='Refresh statistics'
          variant='link'
          onClick={() => {
            currentUser && getUserStats(currentUser.id);
          }}
        >
          <RefreshCcw className={cn(isLoading ? 'animate-spin' : 'animate-none')} />
        </IconButton>
      </div>
      <div
        className={cn(
          isMobile
            ? 'flex-nowrap overflow-x-auto'
            : 'max-h-[500px] flex-wrap items-start justify-start overflow-y-auto',
          'flex w-full snap-x flex-row gap-4 rounded-lg border p-4 leading-snug'
        )}
      >
        {isLoading ? (
          <Skeleton className='h-[350px] w-full' numberOfRows={12} />
        ) : (
          <>
            {bestPerformingTopic?.level_name && (
              <ProfileStatisticsSimpleCardView
                key='best-performing-topic'
                title='Best Performing Topic'
                value={bestPerformingTopic.level_name}
                tooltip='Play Again'
                onClick={() => {
                  router.push(`/level/${bestPerformingTopic.level_id}`);
                }}
              />
            )}
            {mostFreqPlayedTopics &&
              mostFreqPlayedTopics.length > 0 &&
              mostFreqPlayedTopics.map((mostFreqPlayedTopic) => (
                <ProfileStatisticsSimpleCardView
                  key={mostFreqPlayedTopic.level_id}
                  title='Most Frequently Played Topic'
                  value={mostFreqPlayedTopic.level_name}
                  tooltip='Play Again'
                  onClick={() => {
                    router.push(`/level/${mostFreqPlayedTopic.level_id}`);
                  }}
                />
              ))}
            <ProfileStatisticsSimpleCardView
              key='attempted-level-count'
              title='# of Topics Attempted'
              value={`${allPlayedLevels?.length ?? 0}`}
            />
            <ProfileStatisticsSimpleCardView
              key='total-game-completed-count'
              title='# of Games Completed'
              value={`${allPlayedGames?.length ?? 0}`}
            />
            <ProfileStatisticsSimpleCardView
              key='coming-soon'
              title='Stay tuned...'
              value='More stats coming soon!'
            />
          </>
        )}
      </div>
    </div>
  );
}
