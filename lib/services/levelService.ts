import { createClient } from '@/lib/utils/supabase/client';

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
