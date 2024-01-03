import _ from 'lodash';

import { CONSTANTS } from '../constants';
import IGame from '../types/game.type';
import { IScore } from '../types/score.type';
import { getDifficultyMultipliers } from '../utilities';

export const getCompletionSeconds = (completion: number): number => {
  return completion <= 0 ? 1 : completion;
};

export const calculateTimeScore = (score: IScore): number => {
  const scoreCompletionSeconds = getCompletionSeconds(score.completion);
  return Math.max(Math.min(100 - scoreCompletionSeconds, 100), 0);
};

export const getCalculatedScore = (score: IScore, difficulty: number): number => {
  const multipliers = getDifficultyMultipliers(difficulty);
  const timeScore = calculateTimeScore(score) * multipliers.timeMultiplier;
  const aiScore = (score.aiScore ?? 0) * multipliers.promptMultiplier;
  return _.round(timeScore + aiScore, 1);
};

export const aggregateTotalScore = (scores: IScore[], difficulty: number): number => {
  return scores.reduce((acc, score) => {
    return acc + getCalculatedScore(score, difficulty);
  }, 0);
};

export const aggregateTotalTimeTaken = (scores: IScore[]): number => {
  return scores.reduce((acc, score) => {
    return acc + getCompletionSeconds(score.completion);
  }, 0);
};

export const getOverallRating = (totalScore: number, starCounts = 6, maxScore = 300): number => {
  return (totalScore * starCounts) / maxScore;
};

export const getIndividualRating = (score: number, starCounts = 5, maxScore = 100): number => {
  return (score * starCounts) / maxScore;
};

/**
 * Check if the given game object is completed (finished).
 * To consider as finished, the game object must have all the attributes present,
 * including for each score inside, there must exist AI score and AI explanation, cannot
 * be undefined.
 * @param {IGame | undefined | null} game The game object to check.
 * @returns {boolean} True if the game object is completed (finished), false otherwise.
 */
export const isGameFinished = (game: IGame | undefined | null): boolean => {
  if (!game) return false;
  if (game.scores.length !== CONSTANTS.numberOfQuestionsPerGame) return false;
  if (game.scores.some((score) => score.aiScore === undefined || !score.aiExplanation))
    return false;
  return true;
};

/**
 * Check if the given game object has been judged by AI.
 * @param {IGame | undefined | null} game The game object to check.
 * @returns {boolean} True if the game object has been judged by AI, false otherwise.
 */
export const isGameAIJudged = (game: IGame | undefined | null): boolean => {
  if (!game) return false;
  if (!game.scores) return false;
  if (game.scores.some((score) => score.aiScore === undefined || !score.aiExplanation))
    return false;
  return true;
};
