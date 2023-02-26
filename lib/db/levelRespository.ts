import { supabase } from '../supabaseClient';
export const queryAllLevels = async () => {
  const { data, error } = await supabase.from('level').select();
  if (error) {
    throw Error(error.message);
  }
  return {
    levels: data,
  };
};
