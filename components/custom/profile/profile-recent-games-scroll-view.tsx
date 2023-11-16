'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { PlusCircle, RefreshCcw } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '../skeleton';
import { StarRatingBar } from '../star-rating-bar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isMobile, isTablet } from 'react-device-detect';
import { Button } from '@/components/ui/button';

type RecentGame = {
  id: string;
  topicName: string;
  difficultyString: string;
  finishedAt: string;
  totalScore: string;
  totalDuration: string;
  totalRating: number;
};

export default function ProfileRecentGamesScrollView({
  user,
}: {
  user: IUser;
}) {
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
          totalScore: `${totalScore} / 300`,
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
    <div className='w-full flex flex-col gap-2 justify-start'>
      <div className='w-full flex flex-row gap-2 items-center'>
        <h2 className='text-2xl'>Past Games</h2>
        <IconButton
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
      <span className='text-muted-foreground italic mb-2'> Most Recent 5</span>
      <div className='w-full overflow-x-auto flex flex-row gap-4 p-4 justify-start rounded-lg border leading-snug'>
        {isLoading ? (
          <Skeleton className='w-full h-[350px]' numberOfRows={12} />
        ) : (
          recentGames.map((game) => (
            <Tooltip key={game.id}>
              <TooltipTrigger>
                <Card
                  className='text-left max-w-[200px] min-w-[200px] h-full border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg'
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
                    <CardContent className='flex justify-center items-center mt-16'>
                      <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
                    </CardContent>
                  ) : (
                    <CardContent className='flex flex-col gap-3'>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>
                          Diffculty:{' '}
                        </span>
                        <span className='font-bold'>
                          {game.difficultyString}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>
                          Total Time Taken:{' '}
                        </span>
                        <span className='font-bold'>{game.totalDuration}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>
                          Total Score:
                        </span>
                        <span className='font-bold'>{game.totalScore}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='italic text-muted-foreground'>
                          Overall Ratings:{' '}
                        </span>
                        <StarRatingBar
                          rating={game.totalRating}
                          maxRating={6}
                        />
                      </div>
                      {(isMobile || isTablet) && (
                        <Button variant='secondary'>View Results</Button>
                      )}
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
