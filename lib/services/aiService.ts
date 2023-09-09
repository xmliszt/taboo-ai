import ILevel from '../types/level.interface';
import _, { uniqueId } from 'lodash';
import { CONSTANTS } from '../constants';
import { formatResponseTextIntoArray } from '../utilities';
import { IAIScore, IChat } from '../types/score.interface';
import IWord from '../types/word.interface';
import moment from 'moment';
import { DateUtils } from '../utils/dateUtils';

export async function askAITabooWordsForTarget(
  targetWord: string
): Promise<IWord> {
  const target = _.toLower(_.trim(targetWord));
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: [
        {
          role: 'user',
          content: `Generate 5-8 words related to '${target}', in American English. Avoid plural and duplicates. Insert the words in an comma separated array: [word1, word2, ...]`,
        },
      ],
      temperature: 1,
      maxToken: 100,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  const text = json.response;
  const variations = formatResponseTextIntoArray(text, target);
  return {
    target: target,
    taboos: variations,
    isVerified: false,
    updatedAt: moment().format(DateUtils.formats.wordUpdatedAt),
  };
}

export async function askAIForQueryResponse(prompt: IChat[]): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system: 'Answer in American English.',
      prompt: prompt,
      temperature: 0,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  return json.response;
}

export async function askAIForJudgingScore(
  target: string,
  prompt: string
): Promise<IAIScore> {
  const response = await fetch('/api/ai/moderation', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: target,
      prompt: prompt,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  const responseText = json.response;
  const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  const regex =
    /.*"*[Ss]core"*:\s*(\d+)[,.]*\s*"*[Ee]xplanation"*:\s*"*(.+)"*/gim;
  let matches;
  let score: number | undefined;
  let explanation: string | undefined;
  while ((matches = regex.exec(responseText)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    score = Number(_.trim(matches[1]));
    score = Number.isNaN(score) ? 0 : score;
    explanation = _.trim(_.trim(matches[2]), punctuation);
  }
  if (score === undefined || explanation === undefined) {
    throw Error('Unable to generate clue assessment scores');
  }
  return {
    score,
    explanation,
  };
}

export async function askAIForCreativeTopic(
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
      prompt: [
        {
          role: 'user',
          content: `Generate a list of ${CONSTANTS.numberOfQuestionsPerGame} words in the topic of ${topic} that are ${difficultyString}. In American English. Insert the words generated in an array: [word1, word2, ...]`,
        },
      ],
      temperature: 0.8,
      maxToken: 50,
    }),
  });
  const json = await respone.json();
  const text = json.response;
  if (text) {
    const words = formatResponseTextIntoArray(text);
    return {
      id: uniqueId(topic),
      name: topic,
      difficulty: difficulty,
      words: words,
      isVerified: true,
    };
  } else {
    return;
  }
}
