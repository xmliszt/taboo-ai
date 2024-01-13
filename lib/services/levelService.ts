import { createClient } from '@/lib/utils/supabase/client';

import { ILevel } from '../types/level.type';

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
