import Link from 'next/link';
import { isMobile } from 'react-device-detect';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { fetchUserStatistics } from '@/app/profile/server/fetch-user-statistics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ProfileStatisticsSimpleCardView } from './profile-statistics-simple-card';

export async function ProfileStatisticsCardView() {
  const user = await fetchUserProfile();

  if (user.subscription?.customer_plan_type === 'free')
    return (
      <Card className='w-full max-w-[500px]'>
        <CardContent>
          <CardHeader className='my-4 p-0'>
            <CardTitle>Game Statistics</CardTitle>
          </CardHeader>
          <CardDescription>
            Upgrade to PRO plan to unlock your exclusive game statistics. Get more insights on your
            game performance and improve your game play!
          </CardDescription>
          <Link href='/pricing'>
            <Button className='mt-4 w-full animate-pulse'>Upgrade My Plan</Button>
          </Link>
        </CardContent>
      </Card>
    );

  const stats = await fetchUserStatistics(user.id);
  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Game Statistics</h2>
      </div>
      <div
        className={cn(
          isMobile
            ? 'flex-nowrap overflow-x-auto'
            : 'max-h-[500px] flex-wrap items-start justify-start overflow-y-auto',
          'flex w-full snap-x flex-row gap-4 rounded-lg border p-4 leading-snug'
        )}
      >
        {stats.bestPerformedLevel?.level_name && (
          <ProfileStatisticsSimpleCardView
            key='best-performing-topic'
            title='Best Performing Topic'
            value={stats.bestPerformedLevel.level_name}
            actionLabel='Play This Level Again'
            href={`/level/${stats.bestPerformedLevel.level_id}`}
          />
        )}
        {stats.mostFreqPlayedLevels &&
          stats.mostFreqPlayedLevels.length > 0 &&
          stats.mostFreqPlayedLevels.map((mostFreqPlayedTopic) => (
            <ProfileStatisticsSimpleCardView
              key={mostFreqPlayedTopic.level_id}
              title='Most Frequently Played Topic'
              value={mostFreqPlayedTopic.level_name}
              actionLabel='Play This Level Again'
              href={`/level/${mostFreqPlayedTopic.level_id}`}
            />
          ))}
        <ProfileStatisticsSimpleCardView
          key='attempted-level-count'
          title='# of Topics Attempted'
          value={`${stats.uniqueLevelsCount}`}
        />
        <ProfileStatisticsSimpleCardView
          key='total-game-completed-count'
          title='# of Games Completed'
          value={`${stats.gamesCount}`}
        />
        {stats.highestScore && (
          <ProfileStatisticsSimpleCardView
            key='highest-score'
            title='Highest Score Achieved In A Game'
            value={`${stats.highestScore}`}
          />
        )}
        <ProfileStatisticsSimpleCardView
          key='total-time-spent'
          title='Total Time Spent Playing Games'
          value={(() => {
            const totalSeconds = stats.totalDurationSpent;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor((totalSeconds % 3600) % 60);
            // Return in terns of HH:MM:SS, e.g. 00:00:00
            return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
              seconds < 10 ? '0' + seconds : seconds
            }`;
          })()}
          titleFontSize='text-4xl'
        />
        <ProfileStatisticsSimpleCardView
          key='coming-soon'
          title='Stay tuned...'
          value='More stats coming soon!'
        />
      </div>
    </div>
  );
}
