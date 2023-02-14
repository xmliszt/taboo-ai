import { uniqueId } from 'lodash';
import ILevel from '../levels/(models)/level.interface';
import _ from 'lodash';
import { CONSTANTS } from '../constants';
import IVariation from '../(models)/variationModel';

export async function getQueryResponse(prompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Your best response to "${prompt}" in readable form.`,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  return json.response;
}

export async function getWordVariations(word: string): Promise<IVariation> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate words related to ${word}, to be played in a taboo game, includes all lemma (e.g. tenses) for each word, each as a single element in an array in JSON format.`,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  let text = json.response;
  text = text.replace(/^\s+|\s+$/g, '');
  let variations: string[];
  const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  try {
    variations = JSON.parse(text) as string[];
  } catch {
    try {
      const punctuationWithDigits =
        '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0123456789';
      const sanitizedString = _.trim(text, punctuation);
      variations = sanitizedString.split(',');
      variations = _.uniq(
        variations.map((text) =>
          _.trim(text, punctuationWithDigits).toLowerCase()
        )
      );
      if (!variations.includes(word)) {
        variations.push(word);
      }
    } catch {
      variations = [];
    }
  }
  word.split(' ').forEach((part) => variations.push(part));
  variations = variations.map((e) =>
    _.startCase(_.toLower(_.trim(e, punctuation)))
  );
  variations = _.uniq(variations);
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
      prompt: `Generate ${CONSTANTS.numberOfQuestionsPerGame} unique '${topic}' words that are ${difficultyString}, in an array of strings in JSON format.`,
    }),
  });
  const json = await respone.json();
  const text = json.response;
  if (text) {
    let words: string[];
    try {
      words = JSON.parse(text) as string[];
    } catch {
      const wordsString: string = text
        .replaceAll(/\n*\d*\.\s/gi, ',')
        .replaceAll('\n', ',')
        .replaceAll(/^\W/gi, '');
      words = wordsString.split(', ');
      if (words.length < CONSTANTS.numberOfQuestionsPerGame) {
        words = wordsString.split(',');
      }
    }
    words = words.map((word) => _.startCase(_.toLower(word)));
    return {
      id: uniqueId(),
      name: topic,
      difficulty: difficulty,
      words: words,
    };
  } else {
    return;
  }
}
