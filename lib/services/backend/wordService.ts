import IVariation from '../../../types/variation.interface';
import IWord from '../../../types/word.interface';
import {
  getAllWords,
  getWords,
  insertWord,
  updateWord,
} from '../../database/wordRepository';

export async function isWordVariationsExist(word: string): Promise<boolean> {
  const tabooWords = await getTabooWords(word);
  const wordExistInDB = tabooWords.length > 0;
  return wordExistInDB;
}

export async function saveTabooWords(variations: IVariation) {
  const { data } = await getWords(variations.target);
  if (data.length > 0) {
    await updateWord(variations.target, variations.variations);
  } else {
    await insertWord(variations.target, variations.variations);
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
  const _data = data as IWord[];
  return _data;
}
