'use server';

import 'server-only';

import { maxBy } from 'lodash';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { createClient } from '@/lib/utils/supabase/client';

/**
 * Get the game statistics of a user
 */
export async function fetchUserStatistics(userId: string) {
  const supabaseClient = createClient();
  const user = await fetchUserProfile();
  if (user.subscription?.customer_plan_type === 'free')
    throw new Error('You are not authorized to view statistics.');
  const fetchGamesCompletedByUserWithLevelInfoResponse = await supabaseClient
    .from('v_user_played_level_game_with_scores_and_completed_times')
    .select()
    .eq('user_id', userId);
  if (fetchGamesCompletedByUserWithLevelInfoResponse.error)
    throw fetchGamesCompletedByUserWithLevelInfoResponse.error;
  const games = fetchGamesCompletedByUserWithLevelInfoResponse.data;
  const topics = new Map<string, (typeof games)[number]>();
  for (const game of games) {
    const levelId = game.level_id;
    if ((topics.get(levelId)?.total_score ?? 0) < game.total_score) {
      topics.set(levelId, game);
    } else if (topics.get(levelId) === undefined) {
      topics.set(levelId, game);
    }
  }

  const gamesCount = games.length;
  const uniqueLevelsCount = topics.size;
  // levels with highest completed_times
  const mostPlayedTimes = maxBy(games, 'completed_times')?.completed_times ?? 0;
  const mostFreqPlayedLevels = Array.from(topics.values()).filter(
    (level) => level.completed_times === mostPlayedTimes
  );
  const bestPerformedLevel = maxBy(games, 'total_score');
  const highestScore = maxBy(games, 'total_score')?.total_score;
  const totalDurationSpent = games.reduce((acc, game) => acc + game.total_time_taken, 0);
  return {
    gamesCount,
    uniqueLevelsCount,
    mostFreqPlayedLevels,
    bestPerformedLevel,
    highestScore,
    totalDurationSpent,
  };
}
