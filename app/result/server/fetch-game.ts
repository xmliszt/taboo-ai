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
    .select('*,level:levels!inner(*)')
    .eq('game_id', gameId)
    .single();
  if (fetchGameResponse.error) throw fetchGameResponse.error;
  const game = fetchGameResponse.data;
  // fetch scores for the game
  const fetchScoresForGameResponse = await supabaseClient
    .from('v_score_with_ai_evaluations')
    .select()
    .eq('game_id', gameId);
  if (fetchScoresForGameResponse.error) throw fetchScoresForGameResponse.error;
  return {
    ...game,
    scores: fetchScoresForGameResponse.data,
    is_custom_game: false,
  };
};

export type Game = AsyncReturnType<typeof fetchGame>;
