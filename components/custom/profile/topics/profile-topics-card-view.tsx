import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StarRatingBar } from '../../star-rating-bar';
import { Button } from '@/components/ui/button';
import { isMobile, isTablet } from 'react-device-detect';
import IUserLevel from '@/lib/types/userLevel.type';
import { useRouter } from 'next/navigation';
import { getDifficulty } from '@/lib/utilities';
import moment from 'moment';
import { DateUtils } from '@/lib/utils/dateUtils';
import { useEffect, useState } from 'react';
import { getLevel, getLevelStatById } from '@/lib/services/levelService';
import ILevel from '@/lib/types/level.type';
import { getOverallRating } from '@/lib/utils/gameUtils';
import { cn } from '@/lib/utils';
import { Skeleton } from '../../skeleton';
import _ from 'lodash';
import { Medal, RefreshCcw } from 'lucide-react';

interface ProfileTopicsCardViewProps {
  userEmail: string;
  topic: IUserLevel;
}

export default function ProfileTopicsCardView({
  userEmail,
  topic,
}: ProfileTopicsCardViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isChampion, setIsChampion] = useState(false);
  const [topicDetails, setTopicDetails] = useState<ILevel>();

  useEffect(() => {
    loadTopic(topic.levelId);
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
    router.push(`/topics/${levelId}`);
  };

  if (hasError) {
    return (
      <Tooltip key={topic.levelId}>
        <TooltipTrigger>
          <Card
            className='text-left max-w-[250px] min-w-[250px] h-[300px] border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg border-red-500'
            onClick={() => {
              loadTopic(topic.levelId);
            }}
          >
            <CardContent className='p-4 flex justify-center items-center h-full'>
              {isLoading ? (
                <Skeleton numberOfRows={8} />
              ) : (
                <div className='flex flex-col text-center gap-3 justify-center items-center w-full h-full'>
                  <RefreshCcw size={50} strokeWidth={1} />
                  <div>
                    Sorry, we are having trouble loading this topic. Please try
                    again.
                  </div>
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
        <Card
          className={cn(
            isChampion ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]' : '',
            'text-left max-w-[250px] min-w-[250px] h-full border shadow-none hover:scale-105 transition-all ease-in-out hover:cursor-pointer hover:shadow-lg'
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
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>
                    You completed:{' '}
                  </span>
                  <span className='font-bold'>
                    {topic.attempts} {topic.attempts > 1 ? 'times' : 'time'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>
                    Your Best Score:
                  </span>
                  <span className='font-bold'>
                    {topic.bestScore.toFixed(1)}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='italic text-muted-foreground'>
                    Your Rating:{' '}
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
      </TooltipTrigger>
      <TooltipContent>Play Again</TooltipContent>
    </Tooltip>
  );
}
