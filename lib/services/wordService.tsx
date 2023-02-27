import IVariation from '../../app/(models)/variationModel';
import {
  getAllWords,
  getWords,
  insertWord,
  updateWord,
} from '../db/wordRepository';

export async function saveTabooWords(word: string, variations: IVariation) {
  const { data } = await getWords(word);
  if (data.length > 0) {
    await updateWord(word, variations.variations);
  } else {
    await insertWord(word, variations.variations);
  }
}

export async function getTabooWords(word: string) {
  const { data } = await getWords(word);
  if (data.length > 0) {
    const variations: string[] = data[0].taboo_words.split(',');
    return variations.filter((word) => word.length > 0);
  } else {
    return [];
  }
}

export async function getFullWordList() {
  const { data } = await getAllWords();
  return data;
}
