'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { Database } from '@/lib/supabase/extension/types';
import { createClient } from '@/lib/utils/supabase/server';

export type GameToUpload = PartialBy<
  Database['public']['Tables']['games']['Row'],
  'id' | 'user_id'
> & {
  is_custom_game: boolean;
} & {
  scores: ScoreToUpload[];
};

export type ScoreToUpload = PartialBy<
  Database['public']['Tables']['game_scores']['Row'],
  'id' | 'game_id'
> & {
  taboos: string[];
  conversation: ConversationToUpload[];
  highlights: HighlightToUpload[];
  ai_evaluation: AIEvaluationToUpload | null | undefined;
};

export type AIEvaluationToUpload = PartialBy<
  Database['public']['Tables']['game_ai_evaluations']['Row'],
  'score_id'
>;

export type ConversationToUpload = PartialBy<
  Database['public']['Tables']['game_score_conversations']['Row'],
  'id' | 'score_id'
>;

export type HighlightToUpload = PartialBy<
  Database['public']['Tables']['game_score_highlights']['Row'],
  'id' | 'score_id'
>;

/**
 * Uploads a completed game for a user.
 */
export const uploadCompletedGameForUser = async (
  userId: string,
  levelId: string,
  game: GameToUpload
) => {
  const supabaseClient = createClient(cookies());
  const uploadCompletedGameForUserResponse = await supabaseClient.rpc('f_upload_a_game', {
    _user_id: userId,
    _level_id: levelId,
    _game: game,
  });
  if (uploadCompletedGameForUserResponse.error) throw uploadCompletedGameForUserResponse.error;
};
