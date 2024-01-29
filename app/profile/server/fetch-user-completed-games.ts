'use server';

import 'server-only';

import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/client';

/**
 * Get the recent-games completed by a user, with level info, sorted by finishedAt descending, with pagination.
 */
export async function fetchGamesCompletedByUserWithLevelInfo(
  userId: string,
  limit: number,
  offset: number
) {
  const supabaseClient = createClient();
  const fetchGamesCompletedByUserWithLevelInfoResponse = await supabaseClient
    .from('v_user_played_level_game_with_scores_and_completed_times')
    .select()
    .eq('user_id', userId)
    .order('game_finished_at', { ascending: false })
    .range(offset, offset + limit);
  if (fetchGamesCompletedByUserWithLevelInfoResponse.error)
    throw fetchGamesCompletedByUserWithLevelInfoResponse.error;
  return fetchGamesCompletedByUserWithLevelInfoResponse.data;
}

export type GameCompletedByUserWithLevelInfo = AsyncReturnType<
  typeof fetchGamesCompletedByUserWithLevelInfo
>[number];
