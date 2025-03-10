import Link from 'next/link';
import { startCase } from 'lodash';
import { PlusCircle } from 'lucide-react';
import moment from 'moment';

import { GameCompletedByUserWithLevelInfo } from '@/app/profile/server/fetch-user-completed-games';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getDifficulty } from '@/lib/utilities';
import { DateUtils } from '@/lib/utils/dateUtils';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { HoverPerspectiveContainer } from '../../common/hover-perspective-container';
import { StarRatingBar } from '../../star-rating-bar';

type ProfileRecentGameCardProps = {
  game: GameCompletedByUserWithLevelInfo;
};

export function ProfileRecentGameCard({ game }: ProfileRecentGameCardProps) {
  return (
    <Tooltip key={game.game_id}>
      <TooltipTrigger asChild>
        <Link href={game.game_id === 'play-more' ? '/levels' : `/result?id=${game.game_id}`}>
          <HoverPerspectiveContainer className='h-full min-w-[240px] snap-center border text-left leading-snug'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle
                  className={
                    game.game_id == 'play-more'
                      ? 'text-center text-border'
                      : 'text-left text-card-foreground'
                  }
                >
                  {startCase(game.level_name)}
                </CardTitle>
                <CardDescription>
                  {game.game_id == 'play-more'
                    ? ''
                    : moment(game.game_finished_at).format(DateUtils.formats.gamePlayedAt)}
                </CardDescription>
              </CardHeader>
              {game.game_id == 'play-more' ? (
                <CardContent className='flex min-h-[200px] items-center justify-center'>
                  <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
                </CardContent>
              ) : (
                <CardContent className='flex flex-col gap-3'>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Difficulty: </span>
                    <span className='font-bold'>{getDifficulty(game.level_difficulty, false)}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Total time taken: </span>
                    <span className='font-bold'>{game.total_time_taken} seconds</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Total score:</span>
                    <span className='font-bold'>{game.total_score.toFixed(2)}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>Overall ratings: </span>
                    <StarRatingBar rating={getOverallRating(game.total_score)} maxRating={6} />
                  </div>
                  <Link href={`/result?id=${game.game_id}`}>
                    <Button className='w-full' variant='secondary' size='sm'>
                      View results
                    </Button>
                  </Link>
                </CardContent>
              )}
            </Card>
          </HoverPerspectiveContainer>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {game.game_id == 'play-more' ? 'Play more games' : 'View results'}
      </TooltipContent>
    </Tooltip>
  );
}
