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

/**
 * Check if the same user has submitted a level with the same name.
 */
export const isLevelWithSameNameSubmittedBySameUser = async (levelName: string, userId: string) => {
  const supabaseClient = createClient();
  const fetchLevelResponse = await supabaseClient
    .from('levels')
    .select()
    .eq('name', levelName)
    .eq('created_by', userId)
    .maybeSingle();
  if (fetchLevelResponse.error) return false;
  else return fetchLevelResponse.data !== null;
};
