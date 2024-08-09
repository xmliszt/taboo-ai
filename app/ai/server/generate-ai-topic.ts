'use server';

import 'server-only';

import { isString, uniqueId } from 'lodash';
import OpenAI from 'openai';

import { LevelToUpload } from '@/app/level/[id]/server/upload-game';
import { CONSTANTS } from '@/lib/constants';

const openai = new OpenAI();

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

  const systemPrompt = `
  You are tasked to generate a list of ${CONSTANTS.numberOfQuestionsPerGame} words in a given topic by the user, that are ${difficultyString} In American English. You only speak in JSON. Output your response in the following format:
  { "words": ["word1", "word2", ...] }
  `;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify({ topic }) },
    ],
    response_format: {
      type: 'json_object',
    },
  });
  const responseText = completion.choices.at(0)?.message.content;
  if (!responseText) throw new Error('Failed to generate taboo words from AI');
  const responseJSON = JSON.parse(responseText);
  if (!responseJSON.words) throw new Error('Unparsable format from AI response');
  const words = responseJSON.words;
  if (!Array.isArray(words)) throw new Error('Invalid format from AI response');
  if (!words.every(isString)) throw new Error('Invalid format from AI response');

  return {
    created_at: new Date().toISOString(),
    created_by: null,
    is_new: false,
    id: uniqueId(topic),
    name: topic,
    difficulty: difficulty,
    words,
    is_verified: true,
    popularity: 0,
    is_ai_generated: true,
  };
}
