import { Database } from '@/lib/supabase/extension/types';
import { createClient } from '@/lib/utils/supabase/client';

import { ILevel } from '../types/level.type';
import { IUserLevel } from '../types/userLevel.type';

export const getAllLevels = async (): Promise<ILevel[]> => {
  const supabaseClient = createClient();
  const fetchAllLevelsResponse = await supabaseClient.from('levels').select();
  if (fetchAllLevelsResponse.error) {
    throw fetchAllLevelsResponse.error;
  }
  return fetchAllLevelsResponse.data.map((level) => ({ ...level, is_ai_generated: false }));
};

export const addLevel = async ({
  name,
  difficulty,
  words,
  createdBy,
}: {
  name: string;
  difficulty: number;
  words: string[];
  createdBy: string;
}) => {
  const supabaseClient = createClient();
  const insertNewLevelResponse = await supabaseClient.from('levels').insert({
    name,
    difficulty,
    words,
    created_by: createdBy,
  });
  if (insertNewLevelResponse.error) throw insertNewLevelResponse.error;
};

export const getLevel = async (id: string): Promise<ILevel | undefined> => {
  const supabaseClient = createClient();
  const fetchSingleLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('id', id)
    .single();
  if (fetchSingleLevelResponse.error) throw fetchSingleLevelResponse.error;
  return { ...fetchSingleLevelResponse.data, is_ai_generated: false };
};

export const isLevelExists = async (topicName?: string, authorEmail?: string): Promise<boolean> => {
  if (!topicName || !authorEmail) {
    return false;
  }
  const supabaseClient = createClient();
  const fetchSingleUserResponse = await supabaseClient
    .from('users')
    .select()
    .eq('email', authorEmail)
    .single();
  if (fetchSingleUserResponse.error) throw fetchSingleUserResponse.error;
  const fetchSingleLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('name', topicName)
    .single();
  if (fetchSingleLevelResponse.error) throw fetchSingleLevelResponse.error;
  return fetchSingleLevelResponse.data.created_by === fetchSingleUserResponse.data.id;
};

export const updateLevelTargetWords = async (id: string, words: string[]): Promise<void> => {
  const supabaseClient = createClient();
  const updateLevelResponse = await supabaseClient.from('levels').update({ words }).eq('id', id);
  if (updateLevelResponse.error) throw updateLevelResponse.error;
};

export const updateLevelIsNew = async (id: string, isNew: boolean): Promise<void> => {
  const supabaseClient = createClient();
  const updateLevelResponse = await supabaseClient
    .from('levels')
    .update({ is_new: isNew })
    .eq('id', id);
  if (updateLevelResponse.error) throw updateLevelResponse.error;
};

export const deleteLevel = async (id: string): Promise<void> => {
  const supabaseClient = createClient();
  const deleteLevelResponse = await supabaseClient.from('levels').delete().eq('id', id);
  if (deleteLevelResponse.error) throw deleteLevelResponse.error;
};

export const verifyLevel = async (id: string): Promise<void> => {
  const supabaseClient = createClient();
  const verifyLevelResponse = await supabaseClient
    .from('levels')
    .update({ is_verified: true })
    .eq('id', id);
  if (verifyLevelResponse.error) throw verifyLevelResponse.error;
};

export const incrementLevelPopularity = async (id: string) => {
  const supabaseClient = createClient();
  const incrementLevelPopularityResponse = await supabaseClient.rpc('increment', {
    _table_name: 'levels',
    _row_id: id,
    _field_name: 'popularity',
    _x: 1,
  });
  if (incrementLevelPopularityResponse.error) throw incrementLevelPopularityResponse.error;
};

/**
 * Get the most frequently played levels for a user
 * @param uid - user id
 */
export const getMostFreqPlayedLevelsSummary = async (
  uid: string
): Promise<Database['public']['Functions']['get_most_freq_played_levels_for_user']['Returns']> => {
  const supabaseClient = createClient();
  const fetchMostFreqPlayedLevelsResponse = await supabaseClient.rpc(
    'get_most_freq_played_levels_for_user',
    {
      _user_id: uid,
    }
  );
  if (fetchMostFreqPlayedLevelsResponse.error) throw fetchMostFreqPlayedLevelsResponse.error;
  return fetchMostFreqPlayedLevelsResponse.data;
};

/**
 * Get the best performing level for a user
 * @param uid - user id
 */
export const getBestPerformingLevelSummary = async (
  uid: string
): Promise<Database['public']['Functions']['get_best_performing_level_for_user']['Returns']> => {
  const supabaseClient = createClient();
  const fetchBestPerformingLevelResponse = await supabaseClient.rpc(
    'get_best_performing_level_for_user',
    {
      _user_id: uid,
    }
  );
  if (fetchBestPerformingLevelResponse.error) throw fetchBestPerformingLevelResponse.error;
  return fetchBestPerformingLevelResponse.data;
};

/**
 * Get the levels completed by a user
 * @param uid - user id
 */
export const getLevelsCompletedByUser = async (uid: string): Promise<IUserLevel[]> => {
  const supabaseClient = createClient();
  const fetchLevelsCompletedByUserResponse = await supabaseClient.rpc(
    'get_user_played_levels_summary',
    {
      _user_id: uid,
    }
  );
  if (fetchLevelsCompletedByUserResponse.error) throw fetchLevelsCompletedByUserResponse.error;
  return fetchLevelsCompletedByUserResponse.data;
};

export const getLevelStatById = async (
  levelId: string
): Promise<{
  topScore: number;
  topScorerName: string;
  topScorerId: string;
}> => {
  const supabaseClient = createClient();
  const fetchLevelStatResponse = await supabaseClient.rpc('get_game_ranks_desc_for_level', {
    _level_id: levelId,
  });
  if (fetchLevelStatResponse.error) throw fetchLevelStatResponse.error;
  const topPerformance = fetchLevelStatResponse.data[0];
  return {
    topScore: topPerformance.total_score,
    topScorerName: topPerformance.player_name,
    topScorerId: topPerformance.player_id,
  };
};

/**
 * Get the top scorer stats for each level
 */
export async function getLevelTopScorerStats() {
  const supabaseClient = createClient();
  const fetchLevelTopScorerStatsResponse = await supabaseClient
    .from('level_top_scorer_stats')
    .select('*');
  if (fetchLevelTopScorerStatsResponse.error) throw fetchLevelTopScorerStatsResponse.error;
  const levelTopScorerStats: {
    [key: string]: { level_id: string; player_ids: string[]; total_score: number };
  } = {};
  for (const row of fetchLevelTopScorerStatsResponse.data) {
    levelTopScorerStats[row.level_id] = row;
  }
  return levelTopScorerStats;
}
