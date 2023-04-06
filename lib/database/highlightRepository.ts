import { supabase } from '../supabaseClient';
export const insertHighlight = async (
  gameID: string,
  scoreID: number,
  highlightID: number,
  start: number,
  end: number
) => {
  const { error } = await supabase.from('highlight').insert({
    game_id: gameID,
    score_id: scoreID,
    highlight_id: highlightID,
    start: start,
    end: end,
  });
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
};

export const selectHighlightsByIDs = async (
  gameID: string,
  scoreID: number
) => {
  const { data, error } = await supabase
    .from('highlight')
    .select()
    .eq('game_id', gameID)
    .eq('score_id', scoreID);
  if (error) {
    console.error(error);
    throw Error(error.message);
  } else {
    return { data };
  }
};
