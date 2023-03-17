import { supabase } from '../supabaseClient';
export const insertHighlight = async (
  gameID: number,
  scoreID: number,
  start: number,
  end: number
) => {
  const { error } = await supabase.from('highlight').insert({
    game_id: gameID,
    score_id: scoreID,
    start: start,
    end: end,
  });
  if (error) {
    throw Error(error.message);
  }
};
