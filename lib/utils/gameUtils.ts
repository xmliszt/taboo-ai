import _ from 'lodash';

import { CONSTANTS } from '../constants';
import { IGame } from '../types/game.type';
import { IScore } from '../types/score.type';
import { getDifficultyMultipliers } from '../utilities';

export const getCompletionSeconds = (completion: number): number => {
  return Math.max(1, completion);
};

export const calculateTimeScore = (score: IScore): number => {
  const scoreCompletionSeconds = getCompletionSeconds(score.duration);
  return Math.max(Math.min(100 - scoreCompletionSeconds, 100), 0);
};

export const getCalculatedScore = (score: IScore, difficulty: number): number => {
  const multipliers = getDifficultyMultipliers(difficulty);
  const timeScore = calculateTimeScore(score) * multipliers.timeMultiplier;
  const aiScore = (score.ai_evaluation?.ai_score ?? 0) * multipliers.promptMultiplier;
  return _.round(timeScore + aiScore, 1);
};

export const getGameTotalDuration = (game: IGame): number => {
  return aggregateTotalTimeTaken(game.scores);
};

export const getGameTotalScore = (game: IGame, difficulty: number): number => {
  return aggregateTotalScore(game.scores, difficulty);
};

export const aggregateTotalScore = (scores: IScore[], difficulty: number): number => {
  return scores.reduce((acc, score) => {
    return acc + getCalculatedScore(score, difficulty);
  }, 0);
};

export const aggregateTotalTimeTaken = (scores: IScore[]): number => {
  return scores.reduce((acc, score) => {
    return acc + getCompletionSeconds(score.duration);
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
 * To consider as finished, the game object must have all the attribute present,
 * including for each score inside, there must exist AI score and AI explanation, cannot
 * be undefined.
 * @param {IGame} game The game object to check.
 * @returns {boolean} True if the game object is completed (finished), false otherwise.
 */
export const isGameFinished = (game: IGame): boolean => {
  if (game.scores.length !== CONSTANTS.numberOfQuestionsPerGame) return false;
  return !game.scores.some((score) => !score.ai_evaluation);
};

/**
 * Check if AI has judged the given game object.
 * @param {IGame} game The game object to check.
 * @returns {boolean} True if the game object has been judged by AI, false otherwise.
 */
export const isGameAIJudged = (game: IGame): boolean => {
  if (!game.scores) return false;
  return !game.scores.some((score) => !score.ai_evaluation);
};
