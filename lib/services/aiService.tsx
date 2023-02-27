import ILevel from '../../app/levels/(models)/level.interface';
import _ from 'lodash';
import { CONSTANTS } from '../../app/constants';
import IVariation from '../../app/(models)/variationModel';
import { formatResponseTextIntoArray } from '../../app/utilities';
import { getTabooWords } from './wordService';

export async function getQueryResponse(prompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Give your best answer to this prompt: ${prompt}.`,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  return json.response;
}

export async function getWordVariations(word: string): Promise<IVariation> {
  const tabooWords = await getTabooWords(word);
  const wordExistInDB = tabooWords.length > 0;
  if (wordExistInDB) {
    const words = tabooWords.map((word) => _.startCase(_.toLower(word)));
    return {
      target: word,
      variations: words,
    };
  }
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate all most obvious related single-words for '${word}', and lemmatization of '${word}' if available. Insert the words in an comma separated array: [word1, word2, ...]`,
      temperature: 0.8,
      maxToken: 100,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  const text = json.response;
  const variations = formatResponseTextIntoArray(text, word);
  return {
    target: word,
    variations: variations,
  };
}

export async function getCreativeLevel(
  topic: string,
  difficulty: number
): Promise<ILevel | undefined> {
  let difficultyString = '';
  switch (difficulty) {
    case 1:
      difficultyString = 'well-known';
      break;
    case 2:
      difficultyString = 'known by some';
      break;
    case 3:
      difficultyString = 'rare';
      break;
    default:
      difficultyString = 'well-known';
      break;
  }
  const respone = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate a list of ${CONSTANTS.numberOfQuestionsPerGame} words in the topic of ${topic} that are ${difficultyString}. Insert the words generated in an array: [word1, word2, ...]`,
      temperature: 0.8,
      maxToken: 50,
    }),
  });
  const json = await respone.json();
  const text = json.response;
  if (text) {
    const words = formatResponseTextIntoArray(text);
    return {
      name: topic,
      difficulty: difficulty,
      words: words,
    };
  } else {
    return;
  }
}
