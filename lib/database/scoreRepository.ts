import { supabase } from '../supabaseClient';
export const insertNewScore = async (
  gameID: string,
  scoreID: number,
  target: string,
  question: string,
  response: string,
  completion: number,
  ai_score?: number,
  ai_explanation?: string
) => {
  const { data, error } = await supabase
    .from('score')
    .insert({
      game_id: gameID,
      score_id: scoreID,
      target: target,
      question: question,
      response: response,
      completion_duration: completion,
      ai_score: ai_score,
      ai_explanation: ai_explanation,
    })
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return {
    data,
  };
};

export const selectScoresByGameID = async (gameID: string) => {
  const { data, error } = await supabase
    .from('score')
    .select()
    .eq('game_id', gameID);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return {
    data,
  };
};
