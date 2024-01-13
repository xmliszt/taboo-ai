import { createClient } from '@/lib/utils/supabase/client';

import { IGame } from '../types/game.type';

/**
 * Uploads a completed game for a user.
 * @param {string} userId The id of the user that completed the game.
 * @param {string} levelId The id of the level that was completed.
 * @param {IGame} game The game object to upload.
 */
export const uploadCompletedGameForUser = async (userId: string, levelId: string, game: IGame) => {
  const supabaseClient = createClient();
  const uploadCompletedGameForUserResponse = await supabaseClient.rpc('f_upload_a_game', {
    _user_id: userId,
    _level_id: levelId,
    _game: game,
  });
  if (uploadCompletedGameForUserResponse.error) throw uploadCompletedGameForUserResponse.error;
};

/**
 * Fetches details of a game by id.
 */
export const fetchGame = async (gameId: string) => {
  const supabaseClient = createClient();
  const fetchGameResponse = await supabaseClient
    .from('v_game_level_info')
    .select()
    .eq('game_id', gameId)
    .single();
  if (fetchGameResponse.error) throw fetchGameResponse.error;
  const game = fetchGameResponse.data;
  const scores = await fetchScoresForGame(gameId);
  return {
    ...game,
    scores: scores,
    is_custom_game: false,
  };
};

/**
 * Get the games completed by a user, with level info, sorted by finishedAt descending, with pagination.
 */
export const fetchGamesCompletedByUserWithLevelInfo = async (
  userId: string,
  limit: number,
  offset: number
) => {
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
};

export const fetchScoresForGame = async (gameId: string) => {
  const supabaseClient = createClient();
  const fetchScoresForGameResponse = await supabaseClient
    .from('v_score_with_ai_evaluations')
    .select()
    .eq('game_id', gameId);
  if (fetchScoresForGameResponse.error) throw fetchScoresForGameResponse.error;
  return fetchScoresForGameResponse.data;
};
