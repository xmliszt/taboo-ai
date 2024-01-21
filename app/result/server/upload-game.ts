'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

export type ScoreToUpload = {
  target_word: string;
  duration: number;
  score_index: number;
  highlights: {
    start_position: number;
    end_position: number;
  }[];
  conversations: {
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
  }[];
  ai_evaluation?: {
    ai_score: number;
    ai_explanation: string;
    ai_suggestion?: string;
  };
};

/**
 * Uploads a completed game for a user.
 */
export const uploadCompletedGameForUser = async (
  userId: string,
  levelId: string,
  game: {
    started_at: string;
    finished_at: string;
    scores: ScoreToUpload[];
  }
) => {
  const supabaseClient = createClient(cookies());
  const uploadCompletedGameForUserResponse = await supabaseClient.rpc('f_upload_a_game', {
    _user_id: userId,
    _level_id: levelId,
    _game: game,
  });
  if (uploadCompletedGameForUserResponse.error) throw uploadCompletedGameForUserResponse.error;
};
