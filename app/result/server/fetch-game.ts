'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/server';

/**
 * Fetches details of a game by id.
 */
export const fetchGame = async (gameId: string) => {
  const supabaseClient = createClient(cookies());
  const fetchGameResponse = await supabaseClient
    .from('v_game_level_info')
    .select()
    .eq('game_id', gameId)
    .maybeSingle();
  if (fetchGameResponse.error) throw fetchGameResponse.error;
  if (!fetchGameResponse.data) throw new Error('Game not found');
  const game = fetchGameResponse.data;
  const fetchLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('id', game.level_id)
    .single();
  if (fetchLevelResponse.error) throw fetchLevelResponse.error;
  const level = fetchLevelResponse.data;
  // fetch scores for the game
  const fetchScoresForGameResponse = await supabaseClient
    .from('v_score_with_ai_evaluations')
    .select()
    .eq('game_id', gameId);
  if (fetchScoresForGameResponse.error) throw fetchScoresForGameResponse.error;
  return {
    ...game,
    level,
    scores: fetchScoresForGameResponse.data,
    is_custom_game: false,
  };
};

export type Game = AsyncReturnType<typeof fetchGame>;
