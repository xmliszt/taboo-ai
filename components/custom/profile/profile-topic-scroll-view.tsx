'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import { getLevelsByUser } from '@/lib/services/levelService';
import IUser from '@/lib/types/user.type';
import IUserLevel from '@/lib/types/userLevel.type';
import { cn } from '@/lib/utils';

import { Skeleton } from '../skeleton';
import ProfileTopicsCardView from './topics/profile-topics-card-view';

export default function ProfilePlayedTopicScrollView({ user }: { user: IUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [playedTopics, setPlayedTopics] = useState<IUserLevel[]>([]);

  useEffect(() => {
    getPlayedTopicsData(user.email);
  }, [user]);

  const getPlayedTopicsData = async (email: string) => {
    try {
      setIsLoading(true);
      const playedTopics = await getLevelsByUser(email);
      sortPlayedTopics(playedTopics);
      playedTopics.push({
        levelId: 'play-more',
        attempts: 0,
        bestScore: 0,
        lastPlayedAt: new Date(),
      });
      setPlayedTopics(playedTopics);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sort the given IUserLevel array.
   * Firstly by attempts count (descending),
   * Then by last played date (descending),
   * Lastly by best score (descending)
   */
  const sortPlayedTopics = (playedTopics: IUserLevel[]) => {
    playedTopics.sort((a, b) => {
      if (a.attempts === b.attempts) {
        if (a.lastPlayedAt && b.lastPlayedAt) {
          if (a.lastPlayedAt === b.lastPlayedAt) {
            return b.bestScore - a.bestScore;
          }
          return a.lastPlayedAt > b.lastPlayedAt ? -1 : 1;
        }
        return 0;
      }
      return b.attempts - a.attempts;
    });
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
            getPlayedTopicsData(user.email);
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
          playedTopics.map((topic) => (
            <ProfileTopicsCardView key={topic.levelId} userEmail={user.email} topic={topic} />
          ))
        )}
      </div>
    </div>
  );
}
