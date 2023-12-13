'use client';

import IconButton from '@/components/ui/icon-button';
import { fetchRecentGames } from '@/lib/services/gameService';
import { getLevel } from '@/lib/services/levelService';
import IUser from '@/lib/types/user.type';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { DateUtils } from '@/lib/utils/dateUtils';
import {
  aggregateTotalScore,
  aggregateTotalTimeTaken,
  getOverallRating,
} from '@/lib/utils/gameUtils';
import _ from 'lodash';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Skeleton } from '../skeleton';
import ProfileRecentGameCard, { RecentGame } from './profile-recent-game-card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfileRecentGamesScrollView({
  user,
}: {
  user: IUser;
}) {
  const numberOfMostRecentGamesToDisplay =
    user.customerPlanType === 'free' ? 1 : 10;
  const [isLoading, setIsLoading] = useState(false);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecentGamesData(user.email);
  }, []);

  const getRecentGamesData = async (email: string) => {
    try {
      setIsLoading(true);
      const games = await fetchRecentGames(
        email,
        numberOfMostRecentGamesToDisplay,
        0
      );
      const recentGames: RecentGame[] = [];
      for (const game of games) {
        const levelId = game.levelId;
        const level = await getLevel(levelId);
        const topicName = _.startCase(level?.name ?? 'Unknown');
        const difficultyString = getDifficulty(game.difficulty, false);
        const finishedAt = moment(game.finishedAt).format(
          DateUtils.formats.gamePlayedAt
        );
        const totalScore = aggregateTotalScore(game.scores, game.difficulty);
        const totalDuration = aggregateTotalTimeTaken(game.scores);
        const totalRating = getOverallRating(totalScore);
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
    <div className='w-full flex flex-col gap-2 justify-start'>
      <div className='w-full flex flex-row gap-2 items-center'>
        <h2 className='text-2xl'>Past Games</h2>
        <IconButton
          asChild
          tooltip='Refresh past games'
          variant='link'
          onClick={() => {
            getRecentGamesData(user.email);
          }}
        >
          <RefreshCcw
            className={cn(isLoading ? 'animate-spin' : 'animate-none')}
          />
        </IconButton>
      </div>
      <span className='text-muted-foreground italic mb-2'>
        {' '}
        Most Recent{' '}
        {numberOfMostRecentGamesToDisplay === 1
          ? 'Game'
          : `${numberOfMostRecentGamesToDisplay} Games`}
      </span>
      {user.customerPlanType === 'free' && (
        <div className='italic text-sm leading-none text-muted-foreground'>
          To view more past games, upgrade to PRO plan:{' '}
          <Button
            className='underline p-0 animate-pulse'
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
        <Skeleton className='w-full h-[350px]' numberOfRows={12} />
      ) : (
        <div className='w-full overflow-x-auto flex flex-row gap-4 p-4 justify-start rounded-lg border leading-snug snap-x'>
          {recentGames.map((game) => (
            <ProfileRecentGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
