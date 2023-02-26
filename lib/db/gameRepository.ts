import { supabase } from '../supabaseClient';
export const insertNewGame = async (
  levelName: string,
  playerID?: string,
  isPromptVisible = true
) => {
  const { data, error } = await supabase
    .from('game')
    .insert({
      player_id: playerID,
      level: levelName,
      created_at: new Date().toISOString(),
      prompt_visible: isPromptVisible,
    })
    .select();
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};
