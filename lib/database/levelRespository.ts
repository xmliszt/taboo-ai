import IDailyLevel from '../../types/dailyLevel.interface';
import { supabase } from '../supabaseClient';
export const queryAllLevels = async () => {
  const { data, error } = await supabase.from('level').select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return {
    levels: data,
  };
};

export const insertDailyLevel = async (dailyLevel: IDailyLevel) => {
  const { data, error } = await supabase
    .from('daily_level')
    .insert(dailyLevel)
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  const level = data[0] as IDailyLevel;
  return {
    level: level,
  };
};

export const selectDailyLevel = async (today: string) => {
  const { data, error } = await supabase
    .from('daily_level')
    .select()
    .eq('created_date', today);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  const level = data[0] as IDailyLevel;
  return {
    level: level,
  };
};

export const selectDailyLevelByName = async (name: string) => {
  const { data, error } = await supabase
    .from('daily_level')
    .select()
    .eq('name', name);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  const level = data[0] as IDailyLevel;
  return {
    level: level,
  };
};
