import _, { uniqueId } from 'lodash';
import moment from 'moment';

import { CONSTANTS } from '../constants';
import {
  CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES,
  TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES,
} from '../errors/google-ai-error-parser';
import IEvaluation from '../types/evaluation.type';
import ILevel from '../types/level.type';
import { IChat } from '../types/score.type';
import IWord from '../types/word.type';
import { formatResponseTextIntoArray } from '../utilities';
import { DateUtils } from '../utils/dateUtils';

/**
 * Ask the AI for a list of taboo words for a given target word.
 * @param {string} targetWord The target word to generate taboo words for.
 * @returns {Promise<IWord>} The taboo words generated.
 */
export async function askAITabooWordsForTarget(targetWord: string): Promise<IWord> {
  const target = _.toLower(_.trim(targetWord));
  const response = await fetch('/api/chat', {
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
  if (!response.ok) {
    const error = await response.json();
    if (error.class === 'GoogleGenerativeAI') {
      throw new Error(error.message);
    } else {
      throw new Error('Error generating taboo words');
    }
  }
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

/**
 * Ask AI to generate taboo words for a given topic based on the difficulty.
 * @param {string} topic The topic to generate taboo words for.
 * @param {number} difficulty The difficulty of the taboo words.
 * @returns {Promise<IWord>} The taboo words generated.
 */
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
  const response = await fetch('/api/chat', {
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
      safety: 'high',
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.class === 'GoogleGenerativeAI') {
      if (error.message.includes('SAFETY')) {
        throw new Error(
          TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES[
            Math.floor(
              Math.random() * TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES.length
            )
          ]
        );
      }
      throw new Error(error.message);
    } else {
      return;
    }
  }
  const json = await response.json();
  const text = json.response;
  if (text) {
    const words = formatResponseTextIntoArray(text);
    return {
      id: uniqueId(topic),
      name: topic,
      difficulty: difficulty,
      words: words,
      isVerified: true,
      popularity: 0,
      isAIGenerated: true,
    };
  } else {
    return;
  }
}

/**
 * Fetch chat completion from conversation
 * @param {IChat[]} conversation The conversation to complete.
 * @returns {Promise<{conversation: IChat[]}>} The completed conversation.
 */
export async function fetchConversationCompletion(
  conversation: IChat[]
): Promise<{ conversation: IChat[] }> {
  const response = await fetch('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversation: conversation,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.class === 'GoogleGenerativeAI') {
      if (error.message.includes('SAFETY')) {
        throw new Error(
          CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES[
            Math.floor(Math.random() * CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES.length)
          ]
        );
      }
      throw new Error(error.message);
    }
  }
  try {
    const json = await response.json();
    return { conversation: json.conversation };
  } catch (error) {
    console.error(error);
    throw new Error('Error processing the conversation');
  }
}

/**
 * Perform evaluation
 * @param {IEvaluation} evaluation The evaluation to start.
 * @returns {Promise<{score: number, reasoning: string}>} The runId and threadId of the evaluation.
 */
export async function performEvaluation(
  evaluation: IEvaluation
): Promise<{ score: number; reasoning: string }> {
  const response = await fetch('/api/evaluation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evaluation),
  });
  // Get the run_id and thread_id from resposne
  const json = await response.json();
  return json;
}
