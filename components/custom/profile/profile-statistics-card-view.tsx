'use client';

import IconButton from '@/components/ui/icon-button';
import { getUser } from '@/lib/services/userService';
import IUser from '@/lib/types/user.type';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '../skeleton';
import ProfileStatisticsSimpleCardView from './profile-statistics-simple-card';
import { getLevelStatistics } from '@/lib/services/levelService';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

export default function ProfileStatisticsCardView({
  email,
}: {
  email: string;
}) {
  type Topic = { id?: string; name?: string };
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [bestTopic, setBestTopic] = useState<Topic>();
  const [mostFreqTopic, setMostFreqTopic] = useState<Topic>();
  const router = useRouter();

  useEffect(() => {
    getUserData(email);
  }, []);

  const getUserData = async (email: string) => {
    try {
      setIsLoading(true);
      const user = await getUser(email);
      const stats = await getLevelStatistics(email);
      setBestTopic({
        id: stats.bestPerformingLevel?.id,
        name: _.startCase(stats.bestPerformingLevel?.name ?? ''),
      });
      setMostFreqTopic({
        id: stats.mostFrequentlyPlayedLevel?.id,
        name: _.startCase(stats.mostFrequentlyPlayedLevel?.name ?? ''),
      });
      if (user) setUser(user);
      else throw new Error('User not found');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full flex flex-col gap-2 justify-start'>
      <div className='w-full flex flex-row gap-2 items-center'>
        <h2 className='text-2xl'>Game Statistics</h2>
        <IconButton
          asChild
          tooltip='Refresh statistics'
          variant='link'
          onClick={() => {
            getUserData(email);
          }}
        >
          <RefreshCcw
            className={cn(isLoading ? 'animate-spin' : 'animate-none')}
          />
        </IconButton>
      </div>
      <div
        className={cn(
          isMobile
            ? 'overflow-x-auto flex-nowrap'
            : 'flex-wrap justify-start items-start max-h-[500px] overflow-y-auto',
          'w-full flex gap-4 p-4 rounded-lg border leading-snug flex-row '
        )}
      >
        {isLoading ? (
          <Skeleton className='w-full h-[350px]' numberOfRows={12} />
        ) : (
          <>
            {bestTopic?.name && (
              <ProfileStatisticsSimpleCardView
                key='best-performing-topic'
                title='Best Performing Topic'
                value={bestTopic.name}
                tooltip='Play Again'
                onClick={() => {
                  router.push(`/level/${bestTopic.id}`);
                }}
              />
            )}
            {mostFreqTopic?.name && (
              <ProfileStatisticsSimpleCardView
                key='most-frequently-played-topic'
                title='Most Frequently Played Topic'
                value={mostFreqTopic.name}
                tooltip='Play Again'
                onClick={() => {
                  router.push(`/level/${mostFreqTopic.id}`);
                }}
              />
            )}
            <ProfileStatisticsSimpleCardView
              key='attempted-level-count'
              title='# of Topics Attempted'
              value={`${user?.levelPlayedCount ?? 0}`}
            />
            <ProfileStatisticsSimpleCardView
              key='total-game-attempted-count'
              title='# of Games Attempted'
              value={`${user?.gameAttemptedCount ?? 0}`}
            />
            <ProfileStatisticsSimpleCardView
              key='total-game-completed-count'
              title='# of Games Completed'
              value={`${user?.gamePlayedCount ?? 0}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
