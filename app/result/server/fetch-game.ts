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
  // fetch scores for the game
  const fetchGameResponse = await supabaseClient
    .from('games')
    .select(
      '*,scores:game_scores(*,conversations:game_score_conversations!inner(*),highlights:game_score_highlights!inner(*),ai_evaluation:game_ai_evaluations!inner(*),words!inner(*))'
    )
    .eq('id', gameId)
    .single();
  if (fetchGameResponse.error) throw fetchGameResponse.error;
  const game = fetchGameResponse.data;
  const fetchGameLevelInfoResponse = await supabaseClient
    .from('v_game_level_info')
    .select()
    .eq('game_id', gameId)
    .maybeSingle();
  if (fetchGameLevelInfoResponse.error) throw fetchGameLevelInfoResponse.error;
  const gameLevelInfo = fetchGameLevelInfoResponse.data;
  if (!gameLevelInfo) throw new Error('Game not found');
  const fetchLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('id', game.level_id)
    .single();
  if (fetchLevelResponse.error) throw fetchLevelResponse.error;
  const level = fetchLevelResponse.data;
  return {
    ...gameLevelInfo,
    game_id: game.id,
    level,
    scores: game.scores.map((score) => ({
      score_id: score.id,
      score_index: score.score_index,
      duration: score.duration,
      target_word: score.target_word,
      taboo_words: score.words?.taboos ?? [score.target_word],
      game_id: score.game_id,
      ai_score: score.ai_evaluation?.ai_score,
      ai_explanation: score.ai_evaluation?.ai_explanation,
      ai_suggestion: score.ai_evaluation?.ai_suggestion,
      highlights: score.highlights.map((highlight) => ({
        start_position: highlight.start_position,
        end_position: highlight.end_position,
      })),
      conversations: score.conversations.map((conversation) => ({
        role: conversation.role,
        content: conversation.content,
      })),
    })),
    is_custom_game: false,
  };
};

export type Game = AsyncReturnType<typeof fetchGame>;
