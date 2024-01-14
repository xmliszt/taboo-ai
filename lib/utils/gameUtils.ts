import { round } from 'lodash';

import { Game } from '@/app/result/server/fetch-game';

import { getDifficultyMultipliers } from '../utilities';

export const getCompletionSeconds = (completion: number): number => {
  return Math.max(1, completion);
};

export const calculateTimeScore = (score: Game['scores'][number]): number => {
  const scoreCompletionSeconds = getCompletionSeconds(score.duration);
  return Math.max(Math.min(100 - scoreCompletionSeconds, 100), 0);
};

export const getCalculatedScore = (score: Game['scores'][number], difficulty: number): number => {
  const multipliers = getDifficultyMultipliers(difficulty);
  const timeScore = calculateTimeScore(score) * multipliers.timeMultiplier;
  const aiScore = score.ai_score * multipliers.promptMultiplier;
  return round(timeScore + aiScore, 1);
};

export const getOverallRating = (totalScore: number, starCounts = 6, maxScore = 300): number => {
  return (totalScore * starCounts) / maxScore;
};

export const getIndividualRating = (score: number, starCounts = 5, maxScore = 100): number => {
  return (score * starCounts) / maxScore;
};
