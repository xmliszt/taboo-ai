'use client';

import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { isMobile, isTablet } from 'react-device-detect';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { StarRatingBar } from '../star-rating-bar';

export type RecentGame = {
  id: string;
  topicName: string;
  difficultyString: string;
  finishedAt: string;
  totalScore: string;
  totalDuration: string;
  totalRating: number;
};

type ProfileRecentGameCardProps = {
  game: RecentGame;
};

export default function ProfileRecentGameCard({ game }: ProfileRecentGameCardProps) {
  const router = useRouter();

  const goToResult = (gameId: string) => {
    if (gameId == 'play-more') {
      router.push('/levels');
      return;
    }
    router.push(`/result?id=${gameId}`);
  };
  return (
    <Tooltip key={game.id}>
      <TooltipTrigger>
        <Card
          className='h-full min-w-[200px] max-w-[200px] snap-center border text-left leading-snug shadow-none transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-lg'
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
            <CardDescription>{game.id == 'play-more' ? '' : game.finishedAt}</CardDescription>
          </CardHeader>
          {game.id == 'play-more' ? (
            <CardContent className='flex min-h-[200px] items-center justify-center'>
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
  );
}
