'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarRatingBar } from '../star-rating-bar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isMobile, isTablet } from 'react-device-detect';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function ProfileRecentGameCard({
  game,
}: ProfileRecentGameCardProps) {
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
          className='text-left max-w-[200px] min-w-[200px] h-full border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg leading-snug snap-center'
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
                  Difficulty:{' '}
                </span>
                <span className='font-bold'>{game.difficultyString}</span>
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
                <StarRatingBar rating={game.totalRating} maxRating={6} />
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
  );
}
