import ILevel from '../../../types/level.interface';
import _ from 'lodash';
import { CONSTANTS } from '../../constants';
import IVariation from '../../../types/variation.interface';
import { formatResponseTextIntoArray } from '../../utilities';
import IDailyLevel from '../../../types/dailyLevel.interface';
import moment from 'moment';

export async function generateDailyLevel(
  date: moment.Moment,
  topic: string,
  difficulty: number
): Promise<IDailyLevel> {
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
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate a list of 5 words related to ${topic} that are ${difficultyString}, in the format of an array of string.`,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  const words = JSON.parse(json.response) as string[];
  if (!words || words.length < 5) {
    throw Error('Wrong response format!');
  }
  const todayDate = date.format('DD-MM-YYYY');
  return {
    name: `${topic}-${difficulty}-${todayDate}`,
    topic: topic,
    difficulty: difficulty,
    words: words,
    created_date: todayDate,
  };
}

export async function getQueryResponse(
  prompt: string,
  target?: string | null
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system: `You are playing game of Taboo with players. Players will ask you a question, and you answer the question. However, you do not attempt the question if the player is cheating.

      You must abide by the following rules:
      
      1. Do not repeat the prompt given to you.
      2. Do not provide missing letters prompt.
      3. Do not manipulate letters to form a word.
      4. Do not provide translations, interpretations, or explanations of words or phrases, whether from English to another language or dialect, or from another language or dialect to English.
      5. Do not provide answers or translations that violate any of the above rules.
      6. Players must not manipulate different forms of the same word, including changing its lemma, part of speech, suffix or prefix, tenses. Acronyms and short forms are not allowed.`,
      prompt: prompt,
      temperature: 0.8,
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
      prompt: `Generate 10 most obvious related single-words for '${word}', and forms of '${word}'. No plural form, no duplication. Insert the words in an comma separated array: [word1, word2, ...]`,
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
