'use server';

import 'server-only';

import { uniqueId } from 'lodash';

import { CONSTANTS } from '@/lib/constants';
import { googleGeminiPro } from '@/lib/google-ai';
import { LevelToUpload } from '@/lib/types/level.type';
import { formatResponseTextIntoArray } from '@/lib/utilities';

/**
 * Ask AI to generate taboo words for a given topic based on the difficulty.
 */
export async function generateAITopic(
  topic: string,
  difficulty: number
): Promise<LevelToUpload | undefined> {
  let difficultyString;
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

  const prompt = `Generate a list of ${CONSTANTS.numberOfQuestionsPerGame} words in the topic of ${topic} that are ${difficultyString}. In American English. Insert the words generated in an array: [word1, word2, ...]`;
  const completion = await googleGeminiPro.generateContent(prompt);
  const text = completion.response.text();
  const words = formatResponseTextIntoArray(text);
  return {
    created_at: new Date().toISOString(),
    created_by: null,
    is_new: false,
    id: uniqueId(topic),
    name: topic,
    difficulty: difficulty,
    words: words,
    is_verified: true,
    popularity: 0,
    is_ai_generated: true,
  };
}
