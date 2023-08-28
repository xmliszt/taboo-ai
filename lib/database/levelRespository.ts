import _ from 'lodash';
import ILevel from '../types/level.interface';
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
    .ilike('name', `${_.trim(name).toLowerCase()}`);
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
