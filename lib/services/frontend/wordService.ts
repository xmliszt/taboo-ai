import _ from 'lodash';
import IVariation from '../../../types/variation.interface';
import Word from '../../../types/word.interface';

interface ErrorResponse {
  error: string;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  const data: T = await response.json();
  return data;
}

export async function getWords(): Promise<Word[]> {
  const url = `/api/words/get`;
  const { words } = await request<{ words: Word[] }>(url, 'GET');
  const formattedWords: Word[] = [];
  for (const _word of words) {
    formattedWords.push({
      word: _.startCase(_.toLower(_word.word)),
      taboo_words: _word.taboo_words,
    });
  }
  return formattedWords;
}

export async function getVariations(targetWord: string): Promise<string[]> {
  const url = `/api/words/${targetWord}/get`;
  const data = await request<{ variations: string[] }>(url, 'GET');
  return data.variations.map((word) => _.startCase(_.toLower(word)));
}

export async function saveVariations(variation: IVariation): Promise<void> {
  const url = `/api/words/${variation.target}/save`;
  await request(url, 'POST', { variations: variation.variations });
}

export async function wordExists(word: string): Promise<boolean> {
  const url = `/api/words/${word}/exists`;
  const data = await request<{ exists: boolean }>(url, 'GET');
  return data.exists;
}
