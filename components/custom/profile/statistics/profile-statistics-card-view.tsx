import Link from 'next/link';
import { startCase } from 'lodash';

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
      <Card className='w-full'>
        <CardContent>
          <CardHeader className='my-4 p-0'>
            <CardTitle>Game statistics</CardTitle>
          </CardHeader>
          <CardDescription>
            Upgrade to Pro plan to unlock your exclusive game statistics. Get more insights on your
            game performance and improve your game play!
          </CardDescription>
          <Link href='/pricing'>
            <Button className='mt-4 w-full animate-pulse'>Upgrade my plan</Button>
          </Link>
        </CardContent>
      </Card>
    );

  const stats = await fetchUserStatistics(user.id);
  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Game statistics</h2>
      </div>
      <div
        className={cn(
          'flex w-full snap-proximity flex-row gap-4 rounded-lg border p-4 leading-snug',
          'snap-x flex-nowrap items-stretch overflow-x-auto',
          'lg:max-h-[500px] lg:snap-y lg:flex-wrap lg:items-start lg:justify-start lg:overflow-y-auto'
        )}
      >
        {stats.bestPerformedLevel?.level_name && (
          <ProfileStatisticsSimpleCardView
            key='best-performing-topic'
            title='Best performing topic'
            value={startCase(stats.bestPerformedLevel.level_name)}
            actionLabel='Play this level again'
            href={`/level/${stats.bestPerformedLevel.level_id}`}
          />
        )}
        {stats.mostFreqPlayedLevels &&
          stats.mostFreqPlayedLevels.length > 0 &&
          stats.mostFreqPlayedLevels.map((mostFreqPlayedTopic) => (
            <ProfileStatisticsSimpleCardView
              key={mostFreqPlayedTopic.level_id}
              title='Most frequently played topic'
              value={startCase(mostFreqPlayedTopic.level_name)}
              actionLabel='Play this level again'
              href={`/level/${mostFreqPlayedTopic.level_id}`}
            />
          ))}
        <ProfileStatisticsSimpleCardView
          key='attempted-level-count'
          title='# of topics attempted'
          value={`${stats.uniqueLevelsCount}`}
        />
        <ProfileStatisticsSimpleCardView
          key='total-game-completed-count'
          title='# of games completed'
          value={`${stats.gamesCount}`}
        />
        {stats.highestScore && (
          <ProfileStatisticsSimpleCardView
            key='highest-score'
            title='Highest score achieved in a game'
            value={`${stats.highestScore.toFixed(2)}`}
          />
        )}
        <ProfileStatisticsSimpleCardView
          key='total-time-spent'
          title='Total time spent playing games'
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
      </div>
    </div>
  );
}
