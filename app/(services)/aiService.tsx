import { uniqueId } from 'lodash';
import ILevel from '../levels/(models)/level.interface';
import _ from 'lodash';
import { CONSTANTS } from '../constants';

export async function getQueryResponse(prompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
    cache: 'no-store',
  });
  const json = await response.json();
  return json.response;
}

export async function getCreativeLevel(
  topic: string,
  difficulty: number
): Promise<ILevel> {
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
      prompt: `Give me a comma-separated list of ${CONSTANTS.numberOfQuestionsPerGame} unique '${topic}' words that are ${difficultyString}.`,
    }),
  });
  const json = await respone.json();
  const text = json.response;
  console.log(text);
  const wordsString: string = text
    .replaceAll(/\n*\d*\.\s/gi, ',')
    .replaceAll('\n', ',')
    .replaceAll(/^\W/gi, '');
  let words = wordsString.split(', ');
  if (words.length < CONSTANTS.numberOfQuestionsPerGame) {
    words = wordsString.split(',');
  }
  words = words.map((word) => _.startCase(_.toLower(word)));

  return {
    id: uniqueId(),
    name: topic,
    difficulty: difficulty,
    words: words,
  };
}
