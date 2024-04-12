'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { toLower, trim } from 'lodash';

import { googleGeminiPro } from '@/lib/google-ai';
import { formatResponseTextIntoArray } from '@/lib/utilities';

/**
 * Ask AI to generate taboo words for a given topic.
 */
export async function generateTabooWordsFromAI(targetWord: string, topic?: string) {
  cookies(); // opt-out for caching
  console.log(`Generating taboo words for ${targetWord} in ${topic}. Topic is omitted currently.`);
  const target = toLower(trim(targetWord));
  const prompt =
    `Generate 5-8 words related to '${target}',` +
    ` in American English. Avoid plural and duplicates. Insert the words in an comma separated array: [word1, word2, ...]`;

  const completion = await googleGeminiPro.generateContent(prompt);
  const text = completion.response.text();
  const variations = formatResponseTextIntoArray(text, target);
  return {
    word: target,
    taboos: variations,
    is_verified: false,
    updated_at: new Date().toISOString(),
    created_by: null,
  };
}
