import { supabase } from '../supabaseClient';
export const insertWord = async (word: string, tabooWords: string[]) => {
  const { error } = await supabase.from('word').insert({
    word: word,
    taboo_words: tabooWords.join(','),
  });
  if (error) {
    throw Error(error.message);
  }
};

export const updateWord = async (word: string, tabooWords: string[]) => {
  const { error } = await supabase
    .from('word')
    .update({
      word: word,
      taboo_words: tabooWords.filter((word) => word.length > 0).join(','),
    })
    .ilike('word', word.toLowerCase());
  if (error) {
    throw Error(error.message);
  }
};

export const getWords = async (word: string) => {
  const { data, error } = await supabase
    .from('word')
    .select()
    .ilike('word', word.toLowerCase()); // case insensitive matching
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};

export const getAllWords = async () => {
  const { data, error } = await supabase.from('word').select();
  if (error) {
    throw Error(error.message);
  }
  return {
    data,
  };
};
