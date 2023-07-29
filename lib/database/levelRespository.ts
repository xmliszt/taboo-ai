import IDailyLevel from '../../types/dailyLevel.interface';
import ILevel from '../../types/level.interface';
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

export const fetchLevelByName = async (name: string) => {
  const { data, error } = await supabase
    .from('level')
    .select()
    .eq('name', name);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  if (data.length === 0) {
    return {
      level: null,
    };
  } else {
    return {
      level: data[0] as ILevel,
    };
  }
};

export const insertLevel = async (level: ILevel) => {
  const createdAt = level.createdAt;
  const { data, error } = await supabase
    .from('level')
    .insert({
      name: level.name,
      difficulty: level.difficulty,
      new: level.new,
      author: level.author,
      words: level.words.join(','),
      created_at: createdAt ? new Date(createdAt) : new Date(),
      isverified: level.isVerified,
    })
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  const _level = data[0] as ILevel;
  return {
    level: _level,
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
