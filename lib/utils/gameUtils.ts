import { round } from 'lodash';


import { getDifficultyMultipliers } from '../utilities';

export const getCompletionSeconds = (completion: number): number => {
  return Math.max(1, completion);
};

export const calculateTimeScore = (duration: number): number => {
  const scoreCompletionSeconds = getCompletionSeconds(duration);
  return Math.max(Math.min(100 - scoreCompletionSeconds, 100), 0);
};

export const getCalculatedScore = (
  duration: number,
  aiScore: number,
  difficulty: number
): number => {
  const multipliers = getDifficultyMultipliers(difficulty);
  const timeScore = calculateTimeScore(duration) * multipliers.timeMultiplier;
  const score = aiScore * multipliers.promptMultiplier;
  return round(timeScore + score, 1);
};

export const getOverallRating = (totalScore: number, starCounts = 6, maxScore = 300): number => {
  return (totalScore * starCounts) / maxScore;
};

export const getIndividualRating = (score: number, starCounts = 5, maxScore = 100): number => {
  return (score * starCounts) / maxScore;
};
