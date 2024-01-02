'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import IconButton from '@/components/ui/icon-button';
import { getLevelsCompletedByUser } from '@/lib/services/levelService';
import { IUserLevel } from '@/lib/types/userLevel.type';
import { cn } from '@/lib/utils';

import { Skeleton } from '../skeleton';
import ProfileTopicsCardView from './topics/profile-topics-card-view';

export default function ProfilePlayedTopicScrollView() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [playedTopics, setPlayedTopics] = useState<IUserLevel[]>([]);

  useEffect(() => {
    user && getPlayedTopicsData(user.email);
  }, [user]);

  const getPlayedTopicsData = async (email: string) => {
    try {
      setIsLoading(true);
      const playedTopics = await getLevelsCompletedByUser(email);
      playedTopics.push({
        level_id: 'play-more',
        completed_times: 0,
        best_score: 0,
        last_played_at: new Date().toISOString(),
      });
      setPlayedTopics(playedTopics);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Completed Topics</h2>
        <IconButton
          asChild
          tooltip='Refresh past games'
          variant='link'
          onClick={() => {
            user && void getPlayedTopicsData(user.email);
          }}
        >
          <RefreshCcw className={cn(isLoading ? 'animate-spin' : 'animate-none')} />
        </IconButton>
      </div>
      <div className='flex w-full snap-x flex-row justify-start gap-8 overflow-x-auto rounded-lg border p-8 leading-snug'>
        {isLoading ? (
          <Skeleton className='h-[350px] w-full' numberOfRows={12} />
        ) : playedTopics.length === 0 ? (
          <div className='w-full text-center'>
            You have not completed any topics yet.{' '}
            <Link href='/levels' className='underline transition-all hover:text-muted-foreground'>
              Go play some topics
            </Link>
            .
          </div>
        ) : (
          playedTopics.map((topic) => <ProfileTopicsCardView key={topic.level_id} topic={topic} />)
        )}
      </div>
    </div>
  );
}
