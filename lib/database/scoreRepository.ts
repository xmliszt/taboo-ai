import { supabase } from '../supabaseClient';
export const insertNewScore = async (
  gameID: number,
  scoreID: number,
  target: string,
  question: string,
  response: string,
  completion: number
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
    })
    .select();
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};
