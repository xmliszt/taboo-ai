'use server';

import 'server-only';

import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/client';

/**
 * Get the unique topics completed by a user, sorted by finished_at descending
 */
export async function fetchUniqueTopicsCompletedByUser(userId: string) {
  const supabaseClient = createClient();
  const fetchGamesCompletedByUserWithLevelInfoResponse = await supabaseClient
    .from('v_user_played_level_game_with_scores_and_completed_times')
    .select()
    .eq('user_id', userId)
    .order('game_finished_at', { ascending: false });
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
  return Array.from(topics.values())
    .sort((a, b) => new Date(b.game_finished_at).getTime() - new Date(a.game_finished_at).getTime())
    .sort((a, b) => b.total_score - a.total_score);
}

export type UniqueTopicCompletedByUser = AsyncReturnType<
  typeof fetchUniqueTopicsCompletedByUser
>[number];
