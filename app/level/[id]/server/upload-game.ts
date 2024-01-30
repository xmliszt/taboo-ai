'use server';

import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/lib/utils/supabase/server';

export type ScoreToUpload = {
  target_word: string;
  taboo_words: string[];
  duration: number;
  score_index: number;
  highlights: {
    start_position: number;
    end_position: number;
  }[];
  conversations: {
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp: string;
  }[];
  ai_evaluation: {
    ai_score: number;
    ai_explanation: string;
    ai_suggestion: string[] | null;
  };
};

/**
 * Uploads a completed game for a user. Returns the uploaded game id.
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
  console.dir({ userId, levelId, game }, { depth: null });
  const supabaseClient = createClient(cookies());
  const uploadCompletedGameForUserResponse = await supabaseClient.rpc('f_upload_a_game', {
    _user_id: userId,
    _level_id: levelId,
    _game: game,
  });
  if (uploadCompletedGameForUserResponse.error) throw uploadCompletedGameForUserResponse.error;
  return {
    gameId: uploadCompletedGameForUserResponse.data,
  };
};
