'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import { fetchRecentGames } from '@/lib/services/gameService';
import { getLevel } from '@/lib/services/levelService';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { DateUtils } from '@/lib/utils/dateUtils';
import {
  aggregateTotalScore,
  aggregateTotalTimeTaken,
  getOverallRating,
} from '@/lib/utils/gameUtils';

import { Skeleton } from '../skeleton';
import ProfileRecentGameCard, { RecentGame } from './profile-recent-game-card';

export default function ProfileRecentGamesScrollView() {
  const { user, userPlan } = useAuth();
  const numberOfMostRecentGamesToDisplay = userPlan?.type === 'free' ? 1 : 10;
  const [isLoading, setIsLoading] = useState(false);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const router = useRouter();

  useEffect(() => {
    user && getRecentGamesData(user.id);
  }, [user]);

  const getRecentGamesData = async (userId: string) => {
    try {
      setIsLoading(true);
      const games = await fetchRecentGames(userId, numberOfMostRecentGamesToDisplay, 0);
      const recentGames: RecentGame[] = [];
      for (const game of games) {
        const levelId = game.level_id;
        if (!levelId) continue;
        const level = await getLevel(levelId);
        if (!level) continue;
        const topicName = _.startCase(level.name);
        const difficultyString = getDifficulty(level.difficulty, false);
        const finishedAt = moment(game.finished_at).format(DateUtils.formats.gamePlayedAt);
        const totalScore = aggregateTotalScore(game.scores, level.difficulty);
        const totalDuration = aggregateTotalTimeTaken(game.scores);
        const totalRating = getOverallRating(totalScore);
        if (!game.id) continue;
        recentGames.push({
          id: game.id,
          topicName,
          difficultyString,
          finishedAt,
          totalScore: `${totalScore.toFixed(1)} / 300`,
          totalDuration: `${totalDuration} seconds`,
          totalRating,
        });
      }
      // add the last cell as play more game cell
      recentGames.push({
        id: 'play-more',
        topicName: 'Play More Topics',
        difficultyString: '',
        finishedAt: '',
        totalScore: '',
        totalDuration: '',
        totalRating: 0,
      });
      setRecentGames(recentGames);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Past Games</h2>
        <IconButton
          asChild
          tooltip='Refresh past games'
          variant='link'
          onClick={() => {
            user && getRecentGamesData(user.email);
          }}
        >
          <RefreshCcw className={cn(isLoading ? 'animate-spin' : 'animate-none')} />
        </IconButton>
      </div>
      <span className='mb-2 italic text-muted-foreground'>
        {' '}
        Most Recent{' '}
        {numberOfMostRecentGamesToDisplay === 1
          ? 'Game'
          : `${numberOfMostRecentGamesToDisplay} Games`}
      </span>
      {userPlan?.type === 'free' && (
        <div className='text-sm italic leading-none text-muted-foreground'>
          To view more past games, upgrade to PRO plan:{' '}
          <Button
            className='animate-pulse p-0 underline'
            size='sm'
            variant='link'
            onClick={() => {
              router.push('/pricing');
            }}
          >
            Upgrade My Plan
          </Button>
        </div>
      )}
      {isLoading ? (
        <Skeleton className='h-[350px] w-full' numberOfRows={12} />
      ) : (
        <div className='flex w-full snap-x flex-row justify-start gap-4 overflow-x-auto rounded-lg border p-4 leading-snug'>
          {recentGames.map((game) => (
            <ProfileRecentGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
