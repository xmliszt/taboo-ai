'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import moment from 'moment';
import { isMobile, isTablet } from 'react-device-detect';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IconButton from '@/components/ui/icon-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

import { Skeleton } from '../skeleton';
import { StarRatingBar } from '../star-rating-bar';

type RecentGame = {
  id: string;
  topicName: string;
  difficultyString: string;
  finishedAt: string;
  totalScore: string;
  totalDuration: string;
  totalRating: number;
};

export default function ProfileRecentGamesScrollView({ user }: { user: IUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecentGamesData(user.email);
  }, []);

  const getRecentGamesData = async (email: string) => {
    try {
      setIsLoading(true);
      const games = await fetchRecentGames(email, 5, 0);
      const recentGames: RecentGame[] = [];
      for (const game of games) {
        const levelId = game.levelId;
        const level = await getLevel(levelId);
        const topicName = _.startCase(level?.name ?? 'Unknown');
        const difficultyString = getDifficulty(game.difficulty, false);
        const finishedAt = moment(game.finishedAt).format(DateUtils.formats.gamePlayedAt);
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

  const goToResult = (gameId: string) => {
    if (gameId == 'play-more') {
      router.push('/levels');
      return;
    }
    router.push(`/result?id=${gameId}`);
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
            getRecentGamesData(user.email);
          }}
        >
          <RefreshCcw className={cn(isLoading ? 'animate-spin' : 'animate-none')} />
        </IconButton>
      </div>
      <span className='mb-2 italic text-muted-foreground'> Most Recent 5</span>
      <div className='flex w-full flex-row justify-start gap-4 overflow-x-auto rounded-lg border p-4 leading-snug'>
        {isLoading ? (
          <Skeleton className='h-[350px] w-full' numberOfRows={12} />
        ) : (
          recentGames.map((game) => (
            <Tooltip key={game.id}>
              <TooltipTrigger>
                <Card
                  className='h-full min-w-[200px] max-w-[200px] border text-left shadow-none transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-lg'
                  onClick={() => {
                    goToResult(game.id);
                  }}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        game.id == 'play-more'
                          ? 'text-center text-border'
                          : 'text-left text-card-foreground'
                      }
                    >
                      {game.topicName}
                    </CardTitle>
                    <CardDescription>
                      {game.id == 'play-more' ? '' : game.finishedAt}
                    </CardDescription>
                  </CardHeader>
                  {game.id == 'play-more' ? (
                    <CardContent className='mt-16 flex items-center justify-center'>
                      <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
                    </CardContent>
                  ) : (
                    <CardContent className='flex flex-col gap-3'>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>Difficulty: </span>
                        <span className='font-bold'>{game.difficultyString}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>Total Time Taken: </span>
                        <span className='font-bold'>{game.totalDuration}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>Total Score:</span>
                        <span className='font-bold'>{game.totalScore}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>Overall Ratings: </span>
                        <StarRatingBar rating={game.totalRating} maxRating={6} />
                      </div>
                      {(isMobile || isTablet) && <Button variant='secondary'>View Results</Button>}
                    </CardContent>
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                {game.id == 'play-more' ? 'Play More Topics' : 'View Results'}
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </div>
    </div>
  );
}
