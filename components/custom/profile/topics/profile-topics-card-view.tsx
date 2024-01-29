import Link from 'next/link';
import { startCase } from 'lodash';
import { Medal, PlusCircle } from 'lucide-react';

import type { UniqueTopicCompletedByUser } from '@/app/profile/server/fetch-user-completed-topics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getDifficulty } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { StarRatingBar } from '../../star-rating-bar';

interface ProfileTopicsCardViewProps {
  topic: UniqueTopicCompletedByUser;
}

export function ProfileTopicsCardView({ topic }: ProfileTopicsCardViewProps) {
  return (
    <Tooltip key={topic.level_id}>
      <TooltipTrigger asChild>
        {topic.level_id === 'play-more' ? (
          <Link href='/levels'>
            <Card className='h-full min-w-[250px] max-w-[250px] snap-center border text-left shadow-none transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='text-center text-border'>Play More Topics</CardTitle>
              </CardHeader>
              <CardContent className='flex min-h-[300px] items-center justify-center'>
                <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Link href={`/level/${topic.level_id}`}>
            <Card
              className={cn(
                topic.is_best_score ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]' : '',
                'h-full min-w-[250px] max-w-[250px] snap-center border text-left shadow-none transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-lg'
              )}
            >
              <CardHeader>
                <CardTitle className='text-left text-card-foreground'>
                  {startCase(topic.level_name)}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>Difficulty: </span>
                  <span className='font-bold'>{getDifficulty(topic.level_difficulty, false)}</span>
                </div>
                {topic.completed_times > 0 && (
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Completed: </span>
                    <span className='font-bold'>
                      {topic.completed_times} {topic.completed_times > 1 ? 'times' : 'time'}
                    </span>
                  </div>
                )}
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>Best Score:</span>
                  <span className='font-bold'>{topic.total_score.toFixed(2)}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>Best Rating: </span>
                  <StarRatingBar rating={getOverallRating(topic.total_score, 6)} maxRating={6} />
                </div>
                {topic.is_best_score && (
                  <div className='flex flex-row items-center justify-start gap-2'>
                    <Medal size={50} />
                    <span className='italic text-muted-foreground'>
                      You are the <b>Top Scorer</b> for this topic!
                    </span>
                  </div>
                )}
                <Link href={`/level/${topic.level_id}`}>
                  <Button className='w-full' variant='secondary'>
                    Play Again
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {topic.level_id === 'play-more' ? 'Play More Topics' : 'Play Again'}
      </TooltipContent>
    </Tooltip>
  );
}
