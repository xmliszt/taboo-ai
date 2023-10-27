import _ from 'lodash';
import { getDifficulty, getDisplayedTopicName } from '@/lib/utilities';
import { ScoreInfoButton } from '../score-info-button';
import { StarRatingBar } from '../star-rating-bar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ResultsSummaryCard({
  total,
  totalScore,
  topicName,
  difficulty,
}: {
  total: number;
  totalScore: number;
  topicName: string;
  difficulty: number;
}) {
  const rating = (totalScore * 6) / 300;
  const roundedTotalScore = _.round(totalScore, 1);
  const displayTopicName = getDisplayedTopicName(topicName);
  const difficultyName = getDifficulty(difficulty, false);

  return (
    <Card className='shadow-lg text-xl'>
      <CardHeader>
        <div className='flex flex-row justify-between gap-2'>
          <span>
            <span className='font-light'>Topic: </span>
            <span className='font-extrabold'>{displayTopicName}</span>
          </span>
          <span className='font-extrabold'>{difficultyName}</span>
        </div>
      </CardHeader>
      <CardContent className='text-lg'>
        <div className='flex flex-row justify-between'>
          <span>Total Time Taken: </span>
          <span className='font-bold'>{total} seconds</span>
        </div>
        <div className='flex flex-row justify-between'>
          <span>Total Score:</span>
          <div className='flex flex-row items-center'>
            <ScoreInfoButton asChild />
            <span className='font-bold'>{roundedTotalScore} / 300</span>
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <span>Overall Ratings: </span>
          <StarRatingBar rating={rating} maxRating={6} />
        </div>
      </CardContent>
    </Card>
  );
}
