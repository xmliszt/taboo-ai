import IVariation from '../../app/(models)/variationModel';
import {
  getWords,
  insertWord,
  isWordExist,
  updateWord,
} from '../db/wordRepository';

export async function saveTabooWords(word: string, variations: IVariation) {
  const wordExists = await isWordExist(word);
  if (wordExists) {
    await updateWord(word, variations.variations);
  } else {
    await insertWord(word, variations.variations);
  }
}

export async function getTabooWords(word: string) {
  const { data } = await getWords(word);
  if (data.length > 0) {
    const variations: string[] = data[0].taboo_words.split(',');
    return variations;
  } else {
    throw Error('No target word found in db!');
  }
}
