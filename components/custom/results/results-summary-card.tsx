import { round } from 'lodash';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getDifficulty, getDisplayedTopicName } from '@/lib/utilities';
import { getOverallRating } from '@/lib/utils/gameUtils';

import { ScoreInfoButton } from '../score-info-button';
import { StarRatingBar } from '../star-rating-bar';

export default function ResultsSummaryCard({
  total,
  totalScore,
  topicName,
  difficulty,
}: {
  total: number | undefined;
  totalScore: number | undefined;
  topicName: string;
  difficulty: number;
}) {
  const rating = totalScore ? getOverallRating(totalScore) : undefined;
  const roundedTotalScore = totalScore ? round(totalScore, 1) : undefined;
  const displayTopicName = getDisplayedTopicName(topicName);
  const difficultyName = getDifficulty(difficulty, false);

  return (
    <Card className='text-xl shadow-lg'>
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
            <ScoreInfoButton />
            {roundedTotalScore ? (
              <span className='font-bold'>{roundedTotalScore} / 300</span>
            ) : (
              <span className='font-bold'>N/A</span>
            )}
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <span>Overall Ratings: </span>
          {rating ? (
            <StarRatingBar rating={rating} maxRating={6} />
          ) : (
            <span className='font-bold'>N/A</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
