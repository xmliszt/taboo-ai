import { supabase } from '../supabaseClient';
export const insertWord = async (word: string, tabooWords: string[]) => {
  const { data, error } = await supabase
    .from('word')
    .insert({
      word: word,
      taboo_words: tabooWords.join(','),
    })
    .select();
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};

export const updateWord = async (word: string, tabooWords: string[]) => {
  const { data, error } = await supabase
    .from('word')
    .update({
      word: word,
      taboo_words: tabooWords.join(','),
    })
    .eq('word', word)
    .select();
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};

export const isWordExist = async (word: string) => {
  const { data, error } = await supabase.from('word').select().eq('word', word);
  if (error) {
    throw Error(error.message);
  }
  return data.length > 0;
};

export const getWords = async (word: string) => {
  const { data, error } = await supabase.from('word').select().eq('word', word);
  if (error) {
    throw Error(error.message);
  }
  if (data.length <= 0) {
    throw Error('No word found in database!');
  }
  return {
    data,
  };
};
