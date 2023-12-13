import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { Medal, PlusCircle, RefreshCcw } from 'lucide-react';
import IUserLevel from '@/lib/types/userLevel.type';
import ILevel from '@/lib/types/level.type';
import { getLevel, getLevelStatById } from '@/lib/services/levelService';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../../skeleton';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { DateUtils } from '@/lib/utils/dateUtils';
import { getDifficulty } from '@/lib/utilities';
import { StarRatingBar } from '../../star-rating-bar';
import { getOverallRating } from '@/lib/utils/gameUtils';
import { isMobile, isTablet } from 'react-device-detect';
import { Button } from '@/components/ui/button';

interface ProfileTopicsCardViewProps {
  userEmail: string;
  topic: IUserLevel;
}

export default function ProfileTopicsCardView({ userEmail, topic }: ProfileTopicsCardViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isChampion, setIsChampion] = useState(false);
  const [topicDetails, setTopicDetails] = useState<ILevel>();

  useEffect(() => {
    topic.levelId !== 'play-more' && loadTopic(topic.levelId);
  }, []);

  const loadTopic = async (levelId: string) => {
    try {
      setIsLoading(true);
      const topicDetails = await getLevel(levelId);
      const topicStats = await getLevelStatById(levelId);
      setTopicDetails(topicDetails);
      setIsChampion(topicStats?.topScorer === userEmail);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToTopic = (levelId: string) => {
    router.push(levelId === 'play-more' ? '/levels' : `/level/${levelId}`);
  };

  if (hasError) {
    return (
      <Tooltip key={topic.levelId}>
        <TooltipTrigger>
          <Card
            className='text-left max-w-[250px] min-w-[250px] h-[300px] border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg border-red-500 snap-center'
            onClick={() => {
              loadTopic(topic.levelId);
            }}
          >
            <CardContent className='flex h-full items-center justify-center p-4'>
              {isLoading ? (
                <Skeleton numberOfRows={8} />
              ) : (
                <div className='flex h-full w-full flex-col items-center justify-center gap-3 text-center'>
                  <RefreshCcw size={50} strokeWidth={1} />
                  <div>Sorry, we are having trouble loading this topic. Please try again.</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>Reload</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip key={topic.levelId}>
      <TooltipTrigger>
        {topic.levelId === 'play-more' ? (
          <Card
            className='text-left max-w-[250px] min-w-[250px] h-full border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg snap-center'
            onClick={() => {
              goToTopic(topic.levelId);
            }}
          >
            <CardHeader>
              <CardTitle className='text-center text-border'>
                Play More Topics
              </CardTitle>
            </CardHeader>
            <CardContent className='flex justify-center items-center mt-24'>
              <PlusCircle size={50} color='#c1c1c1' strokeWidth={1} />
            </CardContent>
          </Card>
        ) : (
          <Card
            className={cn(
              isChampion ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]' : '',
              'text-left max-w-[250px] min-w-[250px] h-full border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg snap-center'
            )}
            onClick={() => {
              goToTopic(topic.levelId);
            }}
          >
            <CardHeader>
              <CardTitle className='text-left text-card-foreground'>
                {_.startCase(topicDetails?.name ?? '--')}
              </CardTitle>
              <CardDescription>
                {moment(topic.lastPlayedAt).format(
                  DateUtils.formats.gamePlayedAt
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>
                      Difficulty:{' '}
                    </span>
                    <span className='font-bold'>
                      {getDifficulty(topicDetails?.difficulty ?? 1, false)}
                    </span>
                  </div>
                  {topic.attempts > 0 && (
                    <div className='flex flex-col'>
                      <span className='italic text-muted-foreground'>
                        Completed:{' '}
                      </span>
                      <span className='font-bold'>
                        {topic.attempts} {topic.attempts > 1 ? 'times' : 'time'}
                      </span>
                    </div>
                  )}
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>
                      Best Score:
                    </span>
                    <span className='font-bold'>
                      {topic.bestScore.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='italic text-muted-foreground'>
                      Best Rating:{' '}
                    </span>
                    <StarRatingBar
                      rating={getOverallRating(topic.bestScore, 6)}
                      maxRating={6}
                    />
                  </div>
                  {isChampion && (
                    <div className='flex flex-row gap-2 items-center justify-start'>
                      <Medal size={50} />
                      <span className='italic text-muted-foreground'>
                        You are the <b>Top Scorer</b> for this topic!
                      </span>
                    </div>
                  )}

                  {(isMobile || isTablet) && (
                    <Button variant='secondary'>Play Again</Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {topic.levelId === 'play-more' ? 'Play More Topics' : 'Play Again'}
      </TooltipContent>
    </Tooltip>
  );
}
