import Link from 'next/link';
import { startCase } from 'lodash';
import { Medal, PlusCircle } from 'lucide-react';

import type { UniqueTopicCompletedByUser } from '@/app/profile/server/fetch-user-completed-topics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getDifficulty } from '@/lib/utilities';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { HoverPerspectiveContainer } from '../../common/hover-perspective-container';
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
            <HoverPerspectiveContainer className='h-full min-w-[240px] cursor-pointer snap-center border text-left'>
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle className='text-center text-border'>Play More Topics</CardTitle>
                </CardHeader>
                <CardContent className='flex min-h-[200px] items-center justify-center'>
                  <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
                </CardContent>
              </Card>
            </HoverPerspectiveContainer>
          </Link>
        ) : (
          <Link href={`/level/${topic.level_id}`}>
            <HoverPerspectiveContainer className='relative h-full min-w-[240px] max-w-[240px] cursor-pointer snap-center border text-left'>
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle className='text-left text-card-foreground'>
                    {startCase(topic.level_name)}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-1'>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Difficulty: </span>
                    <span className='font-bold'>
                      {getDifficulty(topic.level_difficulty, false)}
                    </span>
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
                    <span className='italic text-muted-foreground'>Best score:</span>
                    <span className='font-bold'>{topic.total_score.toFixed(2)}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Best rating: </span>
                    <StarRatingBar rating={getOverallRating(topic.total_score, 6)} maxRating={6} />
                  </div>
                  {topic.is_best_score && (
                    <div className='my-2 flex flex-row items-center justify-start gap-2'>
                      <Medal size={30} />
                      <span className='text-sm italic text-muted-foreground'>
                        You are the <b>top scorer</b> for this topic!
                      </span>
                    </div>
                  )}
                  <Link href={`/level/${topic.level_id}`}>
                    <Button className='w-full' variant='secondary'>
                      Play again
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              {topic.is_best_score && (
                <div className='rotating-golden-gradient absolute left-0 top-0 -z-10 h-full w-full rounded-lg after:blur-lg'></div>
              )}
            </HoverPerspectiveContainer>
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {topic.level_id === 'play-more' ? 'Play more topics' : 'Play again'}
      </TooltipContent>
    </Tooltip>
  );
}
